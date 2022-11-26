<?php

namespace App\Form;

use App\DataModel\SearchFilter;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SearchFilterType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('category')
            ->add('q')
            ->add('location')
            ->add('offersOrNeeds')
            ->add('min_price')
            ->add('max_price')
            ->add('individuals')
            ->add('pros')
            ->add('deliverable')
            ->add('sortby')
            ->add('dir')
            
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => SearchFilter::class,
            'method' => 'GET',
            'csrf_protection' => false
        ]);
    }
    public function getBlockPrefix()
    {
        return '';
    }
}
