<?php

namespace App\Twig\Extension;

use Twig\TwigFilter;
use DateTimeImmutable;
use Twig\TwigFunction;
use Twig\Extension\AbstractExtension;

class DateFormatExtension extends AbstractExtension
{
    public function getFilters(): array
    {
        return [
            // If your filter generates SAFE HTML, you should add a third
            // parameter: ['is_safe' => ['html']]
            // Reference: https://twig.symfony.com/doc/3.x/advanced.html#automatic-escaping
            new TwigFilter('date_format', [$this, 'doSomething']),
        ];
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('date_format', [$this, 'doSomething']),
        ];
    }

    /**
     * Undocumented function
     *
     * @param DateTimeImmutable $value
     * @return void
     */
    public function doSomething($value)
    {
        return $value->format('d/m/Y, H:i');
    }
}
