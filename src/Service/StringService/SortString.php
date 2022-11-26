<?php
namespace App\Service\StringService;

use Symfony\Component\HttpFoundation\Request;

class SortString
{
    public function currentSortLabel(Request $request)
    {
        if($request->get('sortby'))
        {
            if($request->get('sortby') === 'time' && $request->get('dir') === 'asc')
            {
                return 'Plus anciennes';
            }
            elseif($request->get('sortby') === 'time' && $request->get('dir') === 'desc')
            {
                return 'Plus récentes';
            }
            elseif($request->get('sortby') === 'price' && $request->get('dir') === 'asc')
            {
                return 'Prix croissant';
            }
            elseif($request->get('sortby') === 'price' && $request->get('dir') === 'desc')
            {
                return 'Prix décroissant';
            }
        }
        return 'Pertinence';
    }
}


