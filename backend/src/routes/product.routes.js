const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const auth = require('../middleware/auth');
const { isVendor } = require('../middleware/roles');
const { generateUploadUrl } = require('../utils/s3SignedUrl');

/**
 * GET /api/products
 * List all active products with pagination.
 * Query params: page (default 1), limit (default 12), category, search
 */
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { active: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('vendorId', 'storeName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('List products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching products.',
    });
  }
});

/**
 * GET /api/products/:id
 * Get a single product by ID with vendor info.
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendorId', 'storeName storeDescription')
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.json({
      success: true,
      data: { product },
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching product.',
    });
  }
});

/**
 * POST /api/products
 * Create a new product (vendor/admin only).
 */
router.post('/', auth, isVendor, async (req, res) => {
  try {
    const { title, description, price, type, category, fileKey, thumbnail } =
      req.body;

    if (!title || !description || price == null || !type || !category || !fileKey) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided.',
      });
    }

    // Find vendor profile for current user
    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found.',
      });
    }

    const product = await Product.create({
      vendorId: vendor._id,
      title,
      description,
      price,
      type,
      category,
      fileKey,
      thumbnail: thumbnail || null,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: { product },
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating product.',
    });
  }
});

/**
 * POST /api/products/upload-url
 * Generate a pre-signed S3 upload URL (vendor/admin only).
 */
router.post('/upload-url', auth, isVendor, async (req, res) => {
  try {
    const { fileName, contentType } = req.body;

    if (!fileName || !contentType) {
      return res.status(400).json({
        success: false,
        message: 'fileName and contentType are required.',
      });
    }

    const fileKey = `products/${Date.now()}-${fileName}`;
    const uploadUrl = await generateUploadUrl(fileKey, contentType);

    res.json({
      success: true,
      data: { uploadUrl, fileKey },
    });
  } catch (error) {
    console.error('Upload URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error generating upload URL.',
    });
  }
});

/**
 * PUT /api/products/:id
 * Update a product (vendor/admin only).
 */
router.put('/:id', auth, isVendor, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Ensure the vendor owns this product (unless admin)
    if (req.user.role !== 'admin') {
      const vendor = await Vendor.findOne({ userId: req.user.id });
      if (!vendor || product.vendorId.toString() !== vendor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your own products.',
        });
      }
    }

    const allowedUpdates = [
      'title',
      'description',
      'price',
      'type',
      'category',
      'thumbnail',
      'active',
    ];
    const updates = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully.',
      data: { product: updatedProduct },
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating product.',
    });
  }
});

/**
 * DELETE /api/products/:id
 * Soft-delete a product by setting active to false (vendor/admin only).
 */
router.delete('/:id', auth, isVendor, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Ownership check
    if (req.user.role !== 'admin') {
      const vendor = await Vendor.findOne({ userId: req.user.id });
      if (!vendor || product.vendorId.toString() !== vendor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only delete your own products.',
        });
      }
    }

    product.active = false;
    await product.save();

    res.json({
      success: true,
      message: 'Product deactivated successfully.',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting product.',
    });
  }
});

module.exports = router;
