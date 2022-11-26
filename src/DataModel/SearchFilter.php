<?php
namespace App\DataModel;

use App\Config\CategoryConfig;

class SearchFilter 
{
    public $category;

    public $q;

    public $location;

    public $offersOrNeeds;

    public $min_price;

    public $max_price;

    public $individuals = false;

    public $pros = false;

    public $deliverable = false;

    public $sortby;

    public $dir;

    public function hasMoreFilters():bool
    {
        if(
            $this->offersOrNeeds === null &&
            $this->min_price === null &&
            $this->max_price === null &&
            $this->individuals === false &&
            $this->pros === false &&
            $this->deliverable === false
        )
        {
            return false;
        }
        return true;
    }

    
    public function getCategoryLabel()
    {
        if($this->category)
        {
            return CategoryConfig::CATEGORIES[$this->category];
        }
        return 'Catégories';
    }

    public function getSortLabel()
    {
        if($this->sortby)
        {
            if($this->sortby === 'time' && $this->dir === 'asc')
            {
                return 'Plus anciennes';
            }
            elseif($this->sortby === 'time' && $this->dir === 'desc')
            {
                return 'Plus récentes';
            }
            elseif($this->sortby === 'price' && $this->dir === 'asc')
            {
                return 'Prix croissant';
            }
            elseif($this->sortby === 'price' && $this->dir === 'desc')
            {
                return 'Prix décroissant';
            }
        }
        return 'Pertinence';
    }

   
}