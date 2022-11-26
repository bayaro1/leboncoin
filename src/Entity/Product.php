<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column]
    private ?int $price = null;

    #[ORM\ManyToOne(inversedBy: 'products')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Category $category = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'products')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Location $location = null;

    #[ORM\Column(length: 255)]
    private ?string $offersOrNeeds = null;

    #[ORM\Column(length: 255)]
    private ?string $vendorState = null;

    #[ORM\Column()]
    private ?bool $deliverable = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): self
    {
        $this->category = $category;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getLocation(): ?Location
    {
        return $this->location;
    }

    public function setLocation(?Location $location): self
    {
        $this->location = $location;

        return $this;
    }

    public function getOffersOrNeeds(): ?string
    {
        return $this->offersOrNeeds;
    }

    public function setOffersOrNeeds(string $offersOrNeeds): self
    {
        $this->offersOrNeeds = $offersOrNeeds;

        return $this;
    }

    public function getVendorState(): ?string
    {
        return $this->vendorState;
    }

    public function setVendorState(string $vendorState): self
    {
        $this->vendorState = $vendorState;

        return $this;
    }

    public function isDeliverable(): ?bool
    {
        return $this->deliverable;
    }

    public function setDeliverable(bool $deliverable): self
    {
        $this->deliverable = $deliverable;

        return $this;
    }
}
