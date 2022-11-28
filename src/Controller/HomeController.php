<?php 
namespace App\Controller;

use App\DataModel\SearchFilter;
use App\Repository\ProductRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class HomeController extends AbstractController
{
    public function __construct(
        private ProductRepository $productRepository
    )
    {

    }
    #[Route('/', name:'home_index')]
    public function index():Response
    {
        


        $countResults = $this->productRepository->count(['deliverable' => false, 'offersOrNeeds' => 'offers']);
        return $this->render('home/index.html.twig', [
            'count_results' => $countResults,
            'searchFilter' => new SearchFilter
        ]);
    }
}