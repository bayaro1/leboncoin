<?php
namespace App\Controller;

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
        $pagination = $this->productRepository->findFilteredPaginated($request);
        
        return $this->render('product/index.html.twig', [
            'pagination' => $pagination,
            'count_results' => $pagination->getTotalItemCount(),
            'currentSortLabel' => $this->sortString->currentSortLabel($request)
        ]);
    }
}