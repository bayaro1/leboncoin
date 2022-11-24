<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\Location;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;

class LocationFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for($i=0; $i < 500; $i++) 
        { 
            $location = new location;
            $location->setCity($faker->city)
                    ->setPostalCode(str_replace(' ', '', $faker->postcode))
                    ;
            $manager->persist($location);
        }
        $manager->flush();


    }
}
