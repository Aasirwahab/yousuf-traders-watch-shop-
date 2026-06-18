export interface NavLink {
  label: string;
  hasDropdown?: boolean;
}

export interface Category {
  name: string;
  imageId: string;
}

export interface Product {
  name: string;
  price: string;
  oldPrice: string;
  imageId: string;
}

export interface Feature {
  title: string;
  description: string;
  offsetClass?: string;
}

export interface Article {
  title: string;
  description?: string;
  imageId: string;
  hasReadButton?: boolean;
}

export interface FooterLink {
  label: string;
  href: string;
}
