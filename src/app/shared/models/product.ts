export interface Product {
  _id: string; // Identifiant unique du produit
  nom: string; // Nom du produit
  description?: string; // Description du produit
  prix: number; // Prix du produit
  imageUrl: string; // URL de l'image du produit
  categorie?: string; // Catégorie (facultatif)
  quantiteDispo: number; // Quantité disponible en stock
}
