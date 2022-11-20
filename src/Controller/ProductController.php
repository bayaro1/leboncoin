<?php
namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ProductController extends AbstractController
{
    #[Route('/annonces', name: 'product_index')]
    public function index(Request $request):Response
    {
        return $this->render('product/index.html.twig', [
            'post' => $request->request
        ]);
    }
}