import Category from '../models/Category.js';

const DEFAULT_CATEGORIES = [
  { name: 'Bridal Couture', slug: 'couture', description: 'Heirloom lehengas and wedding ensembles', displayOrder: 1 },
  { name: 'Draped Sarees', slug: 'sarees', description: 'Sculpted metallic tissue and organza sarees', displayOrder: 2 },
  { name: 'Sherwanis & Menswear', slug: 'menswear', description: 'Bespoke silk raw bandhgalas and kurtas', displayOrder: 3 },
  { name: 'Pret Separates', slug: 'pret', description: 'Handloom tunics and contemporary ready-to-wear', displayOrder: 4 },
  { name: 'Embroidered Accessories', slug: 'accessories', description: 'Handcrafted zardozi potlis and stoles', displayOrder: 5 },
];

export const categoryController = {
  // Public: Get all active categories
  async getCategories(req, res, next) {
    try {
      let categories = await Category.find().sort({ displayOrder: 1, createdAt: 1 });
      
      // Auto-initialize defaults if database is empty
      if (categories.length === 0) {
        categories = await Category.insertMany(DEFAULT_CATEGORIES);
      }

      res.json({ success: true, count: categories.length, categories });
    } catch (err) {
      next(err);
    }
  },

  // Admin: Create new category
  async createCategory(req, res, next) {
    try {
      const { name, slug, description, displayOrder } = req.body;
      if (!name) {
        return res.status(400).json({ error: true, message: 'Category name is required.' });
      }

      const generatedSlug = (slug || name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const existing = await Category.findOne({ $or: [{ slug: generatedSlug }, { name: name.trim() }] });
      if (existing) {
        return res.status(400).json({ error: true, message: 'Category with this name or slug already exists.' });
      }

      const category = new Category({
        name: name.trim(),
        slug: generatedSlug,
        description: description || '',
        displayOrder: Number(displayOrder) || 0,
      });

      await category.save();
      res.status(201).json({ success: true, message: 'Category created successfully.', category });
    } catch (err) {
      next(err);
    }
  },

  // Admin: Delete category
  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return res.status(404).json({ error: true, message: 'Category not found.' });
      }

      res.json({ success: true, message: `Category "${category.name}" removed successfully.` });
    } catch (err) {
      next(err);
    }
  },
};

export default categoryController;
