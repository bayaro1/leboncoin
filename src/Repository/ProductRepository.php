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
        if($searchFilter->location)
        {
            $postalCode = explode(' ', $searchFilter->location);
            $location = $this->locationRepository->findOneBy(['postalCode' => $postalCode]);
            $qb->andWhere('p.location = :location')
                ->setParameter('location', $location)
                ;
        }
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
