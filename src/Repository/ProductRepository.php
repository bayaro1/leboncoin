<?php

namespace App\Repository;

use App\Config\CategoryConfig;
use App\Entity\Product;
use Doctrine\ORM\QueryBuilder;
use App\DataModel\SearchFilter;
use App\Repository\LocationRepository;
use Doctrine\Persistence\ManagerRegistry;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\HttpFoundation\Request;
use Knp\Component\Pager\Pagination\PaginationInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @extends ServiceEntityRepository<Product>
 *
 * @method Product|null find($id, $lockMode = null, $lockVersion = null)
 * @method Product|null findOneBy(array $criteria, array $orderBy = null)
 * @method Product[]    findAll()
 * @method Product[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(
        ManagerRegistry $registry, 
        private PaginatorInterface $paginator, 
        private CategoryRepository $categoryRepository,
        private LocationRepository $locationRepository
        )
    {
        parent::__construct($registry, Product::class);
    }

    public function save(Product $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Product $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findTitlesByQ(string $q, $limit = 5)
    {
        $data = $this->createQueryBuilder('p')
                    ->select('DISTINCT(p.title) as title')
                    ->where('p.title LIKE :q')
                    ->setParameter('q', '%'.$q.'%')
                    ->setMaxResults($limit)
                    ->orderBy('p.createdAt', 'DESC')
                    ->getQuery()
                    ->getResult()
                    ;
        $titles = [];
        foreach($data as $d)
        {
            $titles[] = $d['title'];
        }
        return $titles;
    }

    public function findFilteredPaginated(SearchFilter $searchFilter, Request $request):PaginationInterface
    {
        $qb = $this->createQueryBuilder('p')
                        ->join('p.category', 'c')
                        ->join('p.location', 'l')
                        ->select('p', 'c', 'l')
                        ;
        $this->filter($searchFilter, $qb);
            
        $query = $qb->getQuery();

        return $this->paginator->paginate(
            $query, /* query NOT result */
            $request->query->getInt('page', 1), /*page number*/
            10 /*limit per page*/
        );

    }
    public function countFiltered(SearchFilter $searchFilter):?int 
    {
        $qb = $this->createQueryBuilder('p')
                    ->join('p.location', 'l')
                    ->select('p.id')
                    ;
        $this->filter($searchFilter, $qb);
        return count($qb->getQuery()->getResult());
    }
    
    private function filter(SearchFilter $searchFilter, QueryBuilder $qb)
    {
        /*filters*/
        if($searchFilter->category)
        {
            $category = $this->categoryRepository->findOneBy(['name' => CategoryConfig::CATEGORIES[$searchFilter->category]]);
            $qb->andWhere('p.category = :category')
                ->setParameter('category', $category)
                ;
        }
        if($searchFilter->q)
        {
            $qb->andWhere('p.title LIKE :q')
                ->setParameter('q', '%'.$searchFilter->q.'%')
                ;
        }
        $this->locationFilter($searchFilter, $qb);
        /*more-filters*/
        if($searchFilter->offersOrNeeds)
        {
            $qb->andWhere('p.offersOrNeeds = :offersOrNeeds')
                ->setParameter('offersOrNeeds', $searchFilter->offersOrNeeds)
                ;
        }
        if($searchFilter->min_price)
        {
            $qb->andWhere('p.price >= :min_price')
                ->setParameter('min_price', $searchFilter->min_price * 100)
                ;
        }
        if($searchFilter->max_price)
        {
            $qb->andWhere('p.price <= :max_price')
                ->setParameter('max_price', $searchFilter->max_price *100)
                ;
        }
        if($searchFilter->individuals && !$searchFilter->pros)
        {
            $qb->andWhere('p.vendorState = :individual')
                ->setParameter('individual', 'individual')
                ;
        }
        if($searchFilter->pros && !$searchFilter->individuals)
        {
            $qb->andWhere('p.vendorState = :pro')
                ->setParameter('pro', 'pro')
                ;
        }
        if(!$searchFilter->deliverable)
        {
            $qb->andWhere('p.deliverable = false');
        }

        /*sort*/
        if($searchFilter->sortby && in_array($searchFilter->dir, ['asc', 'desc']))
        {
            $qb->orderBy('p.'.$searchFilter->sortby, $searchFilter->dir);
        }
        else
        {
            $qb->orderBy('p.createdAt', 'desc');
        }
    }

    private function locationFilter(SearchFilter $searchFilter, QueryBuilder $qb)
    {
        if($searchFilter->location)
        {
            $locs = explode('_', $searchFilter->location);
            //si une seule location et un rayon est définit
            if(count($locs) === 1 && isset(explode(' ', $locs[0])[2])) {
                $loc_parts = explode(' ', $locs[0]);
                $postcode = $loc_parts[1];
                $radius = (int)(str_replace('r', '', $loc_parts[2])) * 1000;  //rayon en m
                // create curl resource
                $curl = curl_init('https://api-adresse.data.gouv.fr/search?q='.$postcode.'&limit=1&type=municipality');
                curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
                // $output contains the output string
                $data = json_decode(curl_exec($curl));
                curl_close($curl);
                
                $properties = $data->features[0]->properties;

                $qb->andWhere('l.posX > :min_pos_x')
                    ->andWhere('l.posX < :max_pos_x')
                    ->andWhere('l.posY > :min_pos_y')
                    ->andWhere('l.posY < :max_pos_y')
                    ->setParameter('min_pos_x', ($properties->x - $radius) * 100)
                    ->setParameter('max_pos_x', ($properties->x + $radius) * 100)
                    ->setParameter('min_pos_y', ($properties->y - $radius) * 100)
                    ->setParameter('max_pos_y', ($properties->y + $radius) * 100)
                    ;
            }

            else
            {
                $postcodes = [];
                foreach($locs as $loc)
                {
                    $loc_parts = explode(' ', $loc);
                    if(count($loc_parts) > 2)
                    {
                        //traitement spécial puis return;
                    }
                    $postcodes[] = explode(' ', $loc)[1];
                }
                $qb->andWhere('l.postalCode IN(:postcodes)')
                    ->setParameter('postcodes', $postcodes)
                    ;
            }
            
        }

        
    }


//    /**
//     * @return Product[] Returns an array of Product objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Product
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
