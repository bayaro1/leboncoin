<?php
namespace App\Service\StringService;

class CountToString
{
    public static function transform(int $count, string $unit)
    {
        return $count > 1 ? $count .' '.$unit.'s': $count .' '.$unit;
    }
}