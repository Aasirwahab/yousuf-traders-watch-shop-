export interface NavLink {
  label: string;
  hasDropdown?: boolean;
}

export interface Category {
  name: string;
}

export interface Product {
  name: string;
  price: string;
  oldPrice: string;
}

export interface Feature {
  title: string;
  description: string;
}

export interface FooterLink {
  label: string;
  href: string;
}
