<?php

namespace App\DataFixtures;

use App\Entity\Category;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class CategoryFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        foreach(
            [
                'Vacances', 'Emploi', 'Véhicules', 'Immobilier', 'Mode', 'Maison', 'Multimédia', 'Loisirs', 'Animaux', 'Matériel Professionnel', 'Services', 'Divers'
            ]
            as $category_name
        )
        {
            $category = new Category;
            $category->setName($category_name);
            $manager->persist($category);
        }
        $manager->flush();


    }
}
