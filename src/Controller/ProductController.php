<?php
namespace App\Controller;

use App\Form\SearchFilterType;
use App\DataModel\SearchFilter;
use App\Repository\ProductRepository;
use App\Service\StringService\SortString;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ProductController extends AbstractController
{
    public function __construct(
        private ProductRepository $productRepository,
        private SortString $sortString
    )
    {

    }
    #[Route('/recherche', name: 'product_index')]
    public function index(Request $request):Response
    {
        $searchFilter = new SearchFilter;
        $form = $this->createForm(SearchFilterType::class, $searchFilter);
        $form->handleRequest($request);
        $pagination = $this->productRepository->findFilteredPaginated($searchFilter, $request);
        
        return $this->render('product/index.html.twig', [
            'pagination' => $pagination,
            'count_results' => $pagination->getTotalItemCount(),
            'searchFilter' => $searchFilter
        ]);
    }

    #[Route('/recherche/count-results', name: 'product_count_results')]
    public function countResults(Request $request):Response  
    {
        $searchFilter = new SearchFilter;
        $form = $this->createForm(SearchFilterType::class, $searchFilter);
        $form->handleRequest($request);

        $pagination = $this->productRepository->findFilteredPaginated($searchFilter, $request);

        return new Response(json_encode($pagination->getTotalItemCount()));
    }

}