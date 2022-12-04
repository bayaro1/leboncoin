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
        /*postcodes entrés manuellement*/
        $postal_codes = [
            '64100', '64600', '64200', '13300', '75000', '69000', '33000', '13000', '59000', '31000', '65000', '64000', '40000'
        ];


        /*postcodes générés aléatoirement*/
        for($i=0; $i < 500; $i++) 
        {
            $postalCode = (string)(random_int(0, 9));
            $postalCode .= (string)(random_int(0, 9));
            $postalCode .= (string)(random_int(0, 9));
            if(random_int(0, 9) < 7)
            {
                $postalCode .= '0';
            }
            else
            {
                $postalCode .= (string)(random_int(0, 9));
            }
            $postalCode .= '0';
            if(!in_array($postalCode, $postal_codes))
            {
                $postal_codes[] = $postalCode;
            }
        }


        /*création des Locations*/
        foreach($postal_codes as $postalCode) 
        { 
            /*api adresse.gouv ***********************/
            // create curl resource
            $curl = curl_init('https://api-adresse.data.gouv.fr/search?q='.$postalCode.'&limit=1&type=municipality');
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            // $output contains the output string
            $data = json_decode(curl_exec($curl));
            curl_close($curl);
            if(!empty($data->features))
            {
                $properties = $data->features[0]->properties;
                if(isset($properties->x) && isset($properties->y) && isset($properties->city) && isset($properties->postcode))
                {
                    $city = $properties->city;
                    $postalCode = $properties->postcode; 
                    $posX = $properties->x * 100;
                    $posY = $properties->y * 100;           
                    // close curl resource to free up system resources
                    curl_close($curl); 
                    $location = new location;
                    $location->setCity($city)
                            ->setPostalCode($postalCode)
                            ->setPosX($posX)
                            ->setPosY($posY)
                            ;
                    $manager->persist($location);
                }
            }
            
        }
        $manager->flush();


    }
}
