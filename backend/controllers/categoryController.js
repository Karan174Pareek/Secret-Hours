import Category from '../models/Category.js';

const DEFAULT_CATEGORIES = [
  { name: 'Structural Corsetry', slug: 'corsetry', description: 'Architectural bodices and sculpted steel-boned corsets', displayOrder: 1 },
  { name: 'Fluid Drapes & Slips', slug: 'slips', description: 'Bias-cut mulberry silk slips and draped cowl gowns', displayOrder: 2 },
  { name: 'Tailored Rebel Outerwear', slug: 'outerwear', description: 'Oversized structured blazers and cropped statement trenches', displayOrder: 3 },
  { name: 'Contradiction Separates', slug: 'separates', description: 'Wide-leg pleat trousers, organza shirts, and fine knitwear', displayOrder: 4 },
  { name: 'Atelier Accessories', slug: 'accessories', description: 'Discreet minimal leather bags, stoles, and printed silk scarves', displayOrder: 5 },
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
