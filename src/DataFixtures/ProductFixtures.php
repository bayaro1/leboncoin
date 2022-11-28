<?php

namespace App\DataFixtures;

use DateInterval;
use Faker\Factory;
use DateTimeImmutable;
use App\Entity\Product;
use Bezhanov\Faker\Provider\Commerce;
use App\Repository\CategoryRepository;
use App\Repository\LocationRepository;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class ProductFixtures extends Fixture implements DependentFixtureInterface
{
    public function __construct(
        private CategoryRepository $categoryRepository,
        private LocationRepository $locationRepository
    )
    {
    }
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');
        $faker->addProvider(new Commerce($faker));

        $categories = $this->categoryRepository->findAll();
        $locations = $this->locationRepository->findAll();
        
        for($i=0; $i<10000; $i++)
        {
            $duration = 'P'.random_int(0, 5).'Y'.random_int(0, 11).'M'.random_int(0, 30).'DT'.random_int(0, 23).'H'.random_int(0, 59).'M'.random_int(0, 59).'S';
            $offersOrNeeds = random_int(0, 9) <= 8 ? 'offers': 'needs';
            $deliverable = random_int(0, 9) <= 8 ? false: true;
            $vendorState = random_int(0, 9) <= 6 ? 'individual': 'pro';

            $product = new product;
            $product->setTitle($faker->productName)
                    ->setPrice($faker->randomNumber(6))
                    ->setCreatedAt((new DateTimeImmutable())->sub(new DateInterval($duration)))
                    ->setCategory($faker->randomElement($categories))
                    ->setLocation($faker->randomElement($locations))
                    ->setOffersOrNeeds($offersOrNeeds)
                    ->setDeliverable($deliverable)
                    ->setVendorState($vendorState)
                    ;
            $manager->persist($product);
        }
        $manager->flush();


    }
    public function getDependencies()
    {
        return [
            CategoryFixtures::class,
            LocationFixtures::class
        ];
    }
}
