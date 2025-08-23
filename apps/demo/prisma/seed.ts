import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // ============================================================================
  // CLEANUP EXISTING DATA
  // ============================================================================

  console.log("🧹 Cleaning up existing data...");

  // Delete in reverse order of dependencies
  await prisma.auditLog.deleteMany();
  await prisma.systemLog.deleteMany();
  await prisma.session.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.productFile.deleteMany();
  await prisma.postFile.deleteMany();
  await prisma.file.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.address.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.userTag.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleanup completed");

  // ============================================================================
  // CREATE USERS
  // ============================================================================

  console.log("👥 Creating users...");

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      username: "admin",
      firstName: "Admin",
      lastName: "User",
      displayName: "System Administrator",
      password: "hashed_password_here",
      role: "ADMIN",
      status: "ACTIVE",
      emailVerified: true,
      isActive: true,
      timezone: "UTC",
      language: "en",
      theme: "dark",
    },
  });

  const moderatorUser = await prisma.user.create({
    data: {
      email: "moderator@example.com",
      username: "moderator",
      firstName: "Moderator",
      lastName: "User",
      displayName: "Content Moderator",
      password: "hashed_password_here",
      role: "MODERATOR",
      status: "ACTIVE",
      emailVerified: true,
      isActive: true,
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      email: "user@example.com",
      username: "regularuser",
      firstName: "Regular",
      lastName: "User",
      displayName: "Regular User",
      password: "hashed_password_here",
      role: "USER",
      status: "ACTIVE",
      emailVerified: true,
      isActive: true,
    },
  });

  const guestUser = await prisma.user.create({
    data: {
      email: "guest@example.com",
      username: "guest",
      firstName: "Guest",
      lastName: "User",
      displayName: "Guest User",
      password: "hashed_password_here",
      role: "GUEST",
      status: "ACTIVE",
      emailVerified: true,
      isActive: true,
    },
  });

  console.log("✅ Users created");

  // ============================================================================
  // CREATE USER PROFILES
  // ============================================================================

  console.log("👤 Creating user profiles...");

  await prisma.userProfile.create({
    data: {
      userId: adminUser.id,
      website: "https://admin.example.com",
      company: "Example Corp",
      jobTitle: "System Administrator",
      location: "San Francisco, CA",
      timezone: "America/Los_Angeles",
      twitter: "@adminuser",
      linkedin: "admin-user",
      github: "adminuser",
      newsletter: true,
      marketing: false,
      privacy: "private",
    },
  });

  await prisma.userProfile.create({
    data: {
      userId: moderatorUser.id,
      company: "Content Moderation Inc",
      jobTitle: "Content Moderator",
      location: "New York, NY",
      timezone: "America/New_York",
      newsletter: true,
      marketing: true,
      privacy: "public",
    },
  });

  console.log("✅ User profiles created");

  // ============================================================================
  // CREATE TAGS
  // ============================================================================

  console.log("🏷️ Creating tags...");

  const tags = await Promise.all([
    prisma.tag.create({
      data: {
        name: "Technology",
        slug: "technology",
        description: "Technology related content",
        color: "#3B82F6",
        icon: "💻",
      },
    }),
    prisma.tag.create({
      data: {
        name: "Business",
        slug: "business",
        description: "Business and entrepreneurship",
        color: "#10B981",
        icon: "💼",
      },
    }),
    prisma.tag.create({
      data: {
        name: "Lifestyle",
        slug: "lifestyle",
        description: "Lifestyle and personal development",
        color: "#F59E0B",
        icon: "🌟",
      },
    }),
    prisma.tag.create({
      data: {
        name: "Education",
        slug: "education",
        description: "Educational content and tutorials",
        color: "#8B5CF6",
        icon: "📚",
      },
    }),
    prisma.tag.create({
      data: {
        name: "Entertainment",
        slug: "entertainment",
        description: "Entertainment and media",
        color: "#EC4899",
        icon: "🎬",
      },
    }),
  ]);

  console.log("✅ Tags created");

  // ============================================================================
  // CREATE POSTS
  // ============================================================================

  console.log("📝 Creating posts...");

  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: "Getting Started with Prismate",
        slug: "getting-started-with-prismate",
        excerpt: "Learn how to build admin panels with Prismate",
        content:
          "This is a comprehensive guide to getting started with Prismate...",
        summary: "Complete guide to Prismate admin panel generation",
        authorId: adminUser.id,
        status: "PUBLISHED",
        category: "TECHNOLOGY",
        featured: true,
        publishedAt: new Date(),
        isPublic: true,
        allowComments: true,
        metaTitle: "Getting Started with Prismate - Complete Guide",
        metaDescription:
          "Learn how to build admin panels with Prismate in this comprehensive guide",
        keywords: "prismate,admin panel,prisma,next.js,typescript",
        viewCount: 1250,
        likeCount: 89,
        commentCount: 23,
      },
    }),
    prisma.post.create({
      data: {
        title: "Advanced Prisma Schema Design",
        slug: "advanced-prisma-schema-design",
        excerpt: "Best practices for designing complex Prisma schemas",
        content:
          "When designing complex Prisma schemas, there are several considerations...",
        summary: "Best practices for complex Prisma schema design",
        authorId: moderatorUser.id,
        status: "PUBLISHED",
        category: "TECHNOLOGY",
        featured: false,
        publishedAt: new Date(),
        isPublic: true,
        allowComments: true,
        metaTitle: "Advanced Prisma Schema Design - Best Practices",
        metaDescription:
          "Learn best practices for designing complex Prisma schemas",
        keywords: "prisma,schema design,database,orm",
        viewCount: 856,
        likeCount: 67,
        commentCount: 15,
      },
    }),
    prisma.post.create({
      data: {
        title: "Building Scalable Admin Panels",
        slug: "building-scalable-admin-panels",
        excerpt: "Architecture patterns for scalable admin interfaces",
        content:
          "Scalable admin panels require careful consideration of architecture...",
        summary: "Architecture patterns for scalable admin interfaces",
        authorId: regularUser.id,
        status: "DRAFT",
        category: "BUSINESS",
        featured: false,
        isPublic: false,
        allowComments: false,
        keywords: "admin panel,scalability,architecture,design patterns",
      },
    }),
  ]);

  console.log("✅ Posts created");

  // ============================================================================
  // CREATE POST TAGS
  // ============================================================================

  console.log("🔗 Creating post tags...");

  await Promise.all([
    prisma.postTag.create({
      data: {
        postId: posts[0].id,
        tagId: tags[0].id, // Technology
      },
    }),
    prisma.postTag.create({
      data: {
        postId: posts[0].id,
        tagId: tags[2].id, // Lifestyle
      },
    }),
    prisma.postTag.create({
      data: {
        postId: posts[1].id,
        tagId: tags[0].id, // Technology
      },
    }),
    prisma.postTag.create({
      data: {
        postId: posts[1].id,
        tagId: tags[3].id, // Education
      },
    }),
    prisma.postTag.create({
      data: {
        postId: posts[2].id,
        tagId: tags[1].id, // Business
      },
    }),
  ]);

  console.log("✅ Post tags created");

  // ============================================================================
  // CREATE COMMENTS
  // ============================================================================

  console.log("💬 Creating comments...");

  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content:
          "Great article! This really helped me understand Prismate better.",
        authorId: regularUser.id,
        postId: posts[0].id,
        isApproved: true,
        likeCount: 5,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "Very informative post. Looking forward to more content like this.",
        authorId: guestUser.id,
        postId: posts[0].id,
        isApproved: true,
        likeCount: 3,
      },
    }),
    prisma.comment.create({
      data: {
        content: "Thanks for sharing these insights!",
        authorId: regularUser.id,
        postId: posts[1].id,
        isApproved: true,
        likeCount: 2,
      },
    }),
  ]);

  // Create a nested comment
  await prisma.comment.create({
    data: {
      content: "I agree with your point about schema design.",
      authorId: moderatorUser.id,
      postId: posts[1].id,
      parentId: comments[2].id,
      isApproved: true,
      likeCount: 1,
    },
  });

  console.log("✅ Comments created");

  // ============================================================================
  // CREATE LIKES
  // ============================================================================

  console.log("❤️ Creating likes...");

  await Promise.all([
    prisma.like.create({
      data: {
        userId: regularUser.id,
        postId: posts[0].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: guestUser.id,
        postId: posts[0].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: moderatorUser.id,
        postId: posts[1].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: regularUser.id,
        postId: posts[1].id,
      },
    }),
  ]);

  console.log("✅ Likes created");

  // ============================================================================
  // CREATE GROUPS
  // ============================================================================

  console.log("👥 Creating groups...");

  const groups = await Promise.all([
    prisma.group.create({
      data: {
        name: "Prismate Developers",
        slug: "prismate-developers",
        description: "Community for Prismate developers",
        isPublic: true,
        isVerified: true,
        allowInvites: true,
        memberCount: 0,
        postCount: 0,
      },
    }),
    prisma.group.create({
      data: {
        name: "Prisma Experts",
        slug: "prisma-experts",
        description: "Advanced Prisma users and experts",
        isPublic: true,
        isVerified: false,
        allowInvites: false,
        memberCount: 0,
        postCount: 0,
      },
    }),
  ]);

  console.log("✅ Groups created");

  // ============================================================================
  // CREATE GROUP MEMBERS
  // ============================================================================

  console.log("👤 Adding group members...");

  await Promise.all([
    prisma.groupMember.create({
      data: {
        groupId: groups[0].id,
        userId: adminUser.id,
        role: "admin",
      },
    }),
    prisma.groupMember.create({
      data: {
        groupId: groups[0].id,
        userId: moderatorUser.id,
        role: "moderator",
      },
    }),
    prisma.groupMember.create({
      data: {
        groupId: groups[0].id,
        userId: regularUser.id,
        role: "member",
      },
    }),
    prisma.groupMember.create({
      data: {
        groupId: groups[1].id,
        userId: adminUser.id,
        role: "admin",
      },
    }),
  ]);

  // Update group member counts
  await prisma.group.update({
    where: { id: groups[0].id },
    data: { memberCount: 3 },
  });

  await prisma.group.update({
    where: { id: groups[1].id },
    data: { memberCount: 1 },
  });

  console.log("✅ Group members added");

  // ============================================================================
  // CREATE FOLLOWS
  // ============================================================================

  console.log("👥 Creating follows...");

  await Promise.all([
    prisma.follow.create({
      data: {
        followerId: regularUser.id,
        followingId: adminUser.id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: guestUser.id,
        followingId: adminUser.id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: regularUser.id,
        followingId: moderatorUser.id,
      },
    }),
  ]);

  console.log("✅ Follows created");

  // ============================================================================
  // CREATE USER TAGS
  // ============================================================================

  console.log("🏷️ Adding user tags...");

  await Promise.all([
    prisma.userTag.create({
      data: {
        userId: adminUser.id,
        tagId: tags[0].id, // Technology
      },
    }),
    prisma.userTag.create({
      data: {
        userId: moderatorUser.id,
        tagId: tags[0].id, // Technology
      },
    }),
    prisma.userTag.create({
      data: {
        userId: regularUser.id,
        tagId: tags[1].id, // Business
      },
    }),
  ]);

  // Update tag user counts
  await prisma.tag.update({
    where: { id: tags[0].id },
    data: { userCount: 2 },
  });

  await prisma.tag.update({
    where: { id: tags[1].id },
    data: { userCount: 1 },
  });

  console.log("✅ User tags created");

  // ============================================================================
  // CREATE PRODUCTS
  // ============================================================================

  console.log("🛍️ Creating products...");

  const products = await Promise.all([
    prisma.product.create({
      data: {
        sku: "PRISMATE-PRO",
        name: "Prismate Pro License",
        slug: "prismate-pro-license",
        description: "Professional license for Prismate with advanced features",
        shortDescription: "Pro license with advanced features",
        price: 299.99,
        comparePrice: 399.99,
        costPrice: 150.0,
        taxRate: 8.5,
        stock: 100,
        lowStockThreshold: 10,
        trackInventory: true,
        weight: 0.1,
        dimensions: '{"length": 0, "width": 0, "height": 0}',
        brand: "Prismate",
        model: "Pro License",
        isActive: true,
        isFeatured: true,
        isDigital: true,
      },
    }),
    prisma.product.create({
      data: {
        sku: "PRISMATE-ENTERPRISE",
        name: "Prismate Enterprise License",
        slug: "prismate-enterprise-license",
        description: "Enterprise license for large organizations",
        shortDescription: "Enterprise license for large organizations",
        price: 999.99,
        comparePrice: 1299.99,
        costPrice: 400.0,
        taxRate: 8.5,
        stock: 50,
        lowStockThreshold: 5,
        trackInventory: true,
        weight: 0.1,
        dimensions: '{"length": 0, "width": 0, "height": 0}',
        brand: "Prismate",
        model: "Enterprise License",
        isActive: true,
        isFeatured: false,
        isDigital: true,
      },
    }),
  ]);

  console.log("✅ Products created");

  // ============================================================================
  // CREATE ADDRESSES
  // ============================================================================

  console.log("📍 Creating addresses...");

  const addresses = await Promise.all([
    prisma.address.create({
      data: {
        userId: regularUser.id,
        type: "shipping",
        firstName: "Regular",
        lastName: "User",
        company: "Example Corp",
        address1: "123 Main Street",
        address2: "Suite 100",
        city: "San Francisco",
        state: "CA",
        postalCode: "94105",
        country: "USA",
        phone: "+1-555-0123",
        isDefault: true,
        isActive: true,
      },
    }),
    prisma.address.create({
      data: {
        userId: regularUser.id,
        type: "billing",
        firstName: "Regular",
        lastName: "User",
        company: "Example Corp",
        address1: "123 Main Street",
        address2: "Suite 100",
        city: "San Francisco",
        state: "CA",
        postalCode: "94105",
        country: "USA",
        phone: "+1-555-0123",
        isDefault: true,
        isActive: true,
      },
    }),
  ]);

  console.log("✅ Addresses created");

  // ============================================================================
  // CREATE ORDERS
  // ============================================================================

  console.log("📦 Creating orders...");

  const orders = await Promise.all([
    prisma.order.create({
      data: {
        orderNumber: "ORD-001",
        userId: regularUser.id,
        status: "CONFIRMED",
        total: 299.99,
        subtotal: 276.49,
        tax: 23.5,
        shipping: 0,
        discount: 0,
        customerEmail: "user@example.com",
        customerName: "Regular User",
        customerPhone: "+1-555-0123",
        shippingAddressId: addresses[0].id,
        billingAddressId: addresses[1].id,
        paymentMethod: "CREDIT_CARD",
        paymentStatus: "paid",
        transactionId: "TXN-123456",
        notes: "First order from regular user",
      },
    }),
  ]);

  console.log("✅ Orders created");

  // ============================================================================
  // CREATE ORDER ITEMS
  // ============================================================================

  console.log("📋 Creating order items...");

  await prisma.orderItem.create({
    data: {
      orderId: orders[0].id,
      productId: products[0].id,
      quantity: 1,
      price: 299.99,
      total: 299.99,
    },
  });

  console.log("✅ Order items created");

  // ============================================================================
  // CREATE REVIEWS
  // ============================================================================

  console.log("⭐ Creating reviews...");

  await prisma.review.create({
    data: {
      userId: regularUser.id,
      productId: products[0].id,
      rating: 5,
      title: "Excellent Product!",
      content:
        "Prismate Pro has transformed how I build admin panels. Highly recommended!",
      isApproved: true,
      isVerified: true,
    },
  });

  console.log("✅ Reviews created");

  // ============================================================================
  // CREATE FILES
  // ============================================================================

  console.log("📁 Creating files...");

  const files = await Promise.all([
    prisma.file.create({
      data: {
        filename: "prismate-logo.png",
        originalName: "prismate-logo.png",
        mimeType: "image/png",
        size: 102400,
        type: "IMAGE",
        path: "/uploads/images/prismate-logo.png",
        url: "https://example.com/uploads/images/prismate-logo.png",
        alt: "Prismate Logo",
        caption: "Official Prismate logo",
        description: "High-quality logo for Prismate",
        tags: "logo,brand,prismate",
        isProcessed: true,
        processingStatus: "completed",
        metadata: '{"width": 512, "height": 512, "format": "PNG"}',
        isPublic: true,
        userId: adminUser.id,
      },
    }),
    prisma.file.create({
      data: {
        filename: "getting-started-guide.pdf",
        originalName: "getting-started-guide.pdf",
        mimeType: "application/pdf",
        size: 2048000,
        type: "DOCUMENT",
        path: "/uploads/documents/getting-started-guide.pdf",
        url: "https://example.com/uploads/documents/getting-started-guide.pdf",
        alt: "Getting Started Guide",
        caption: "Complete guide to getting started with Prismate",
        description: "PDF guide for new Prismate users",
        tags: "guide,documentation,pdf",
        isProcessed: true,
        processingStatus: "completed",
        metadata: '{"pages": 45, "format": "PDF", "version": "1.0"}',
        isPublic: true,
        userId: adminUser.id,
      },
    }),
  ]);

  console.log("✅ Files created");

  // ============================================================================
  // CREATE POST FILES
  // ============================================================================

  console.log("📎 Linking files to posts...");

  await prisma.postFile.create({
    data: {
      postId: posts[0].id,
      fileId: files[0].id,
      order: 1,
    },
  });

  console.log("✅ Post files created");

  // ============================================================================
  // CREATE PRODUCT FILES
  // ============================================================================

  console.log("🖼️ Linking files to products...");

  await prisma.productFile.create({
    data: {
      productId: products[0].id,
      fileId: files[0].id,
      type: "image",
      order: 1,
    },
  });

  console.log("✅ Product files created");

  // ============================================================================
  // CREATE NOTIFICATIONS
  // ============================================================================

  console.log("🔔 Creating notifications...");

  await Promise.all([
    prisma.notification.create({
      data: {
        userId: regularUser.id,
        type: "EMAIL",
        title: "Welcome to Prismate!",
        message:
          "Thank you for joining our community. We're excited to have you on board!",
        data:
          '{"action": "welcome", "timestamp": "' +
          new Date().toISOString() +
          '"}',
        isRead: false,
        isSent: true,
        sentAt: new Date(),
      },
    }),
    prisma.notification.create({
      data: {
        userId: regularUser.id,
        type: "IN_APP",
        title: "Order Confirmed",
        message:
          "Your order ORD-001 has been confirmed and is being processed.",
        data: '{"orderId": "' + orders[0].id + '", "orderNumber": "ORD-001"}',
        isRead: false,
        isSent: true,
        sentAt: new Date(),
      },
    }),
  ]);

  console.log("✅ Notifications created");

  // ============================================================================
  // CREATE SESSIONS
  // ============================================================================

  console.log("🔐 Creating sessions...");

  await Promise.all([
    prisma.session.create({
      data: {
        userId: adminUser.id,
        token: "admin-session-token-123",
        ipAddress: "192.168.1.100",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        device: "Desktop",
        isActive: true,
        lastActivity: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    }),
    prisma.session.create({
      data: {
        userId: regularUser.id,
        token: "user-session-token-456",
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
        device: "Mobile",
        isActive: true,
        lastActivity: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    }),
  ]);

  console.log("✅ Sessions created");

  // ============================================================================
  // CREATE SYSTEM LOGS
  // ============================================================================

  console.log("📝 Creating system logs...");

  await Promise.all([
    prisma.systemLog.create({
      data: {
        level: "info",
        category: "seeding",
        message: "Database seeding started",
        data: '{"totalUsers": 4, "totalPosts": 3, "totalProducts": 2}',
        userId: adminUser.id,
        ipAddress: "127.0.0.1",
        userAgent: "Prisma Seed Script",
        path: "/prisma/seed",
        method: "POST",
      },
    }),
    prisma.systemLog.create({
      data: {
        level: "info",
        category: "seeding",
        message: "Users created successfully",
        data: '{"admin": 1, "moderator": 1, "user": 1, "guest": 1}',
        userId: adminUser.id,
        ipAddress: "127.0.0.1",
        userAgent: "Prisma Seed Script",
        path: "/prisma/seed",
        method: "POST",
      },
    }),
  ]);

  console.log("✅ System logs created");

  // ============================================================================
  // CREATE AUDIT LOGS
  // ============================================================================

  console.log("🔍 Creating audit logs...");

  await prisma.auditLog.create({
    data: {
      action: "create",
      entity: "User",
      entityId: adminUser.id,
      userId: adminUser.id,
      oldValues: null,
      newValues: JSON.stringify({
        email: "admin@example.com",
        username: "admin",
        role: "ADMIN",
        status: "ACTIVE",
      }),
      ipAddress: "127.0.0.1",
      userAgent: "Prisma Seed Script",
    },
  });

  console.log("✅ Audit logs created");

  // ============================================================================
  // UPDATE COUNTERS
  // ============================================================================

  console.log("📊 Updating counters...");

  // Update tag post counts
  await prisma.tag.update({
    where: { id: tags[0].id },
    data: { postCount: 2 }, // Technology tag used in 2 posts
  });

  await prisma.tag.update({
    where: { id: tags[1].id },
    data: { postCount: 1 }, // Business tag used in 1 post
  });

  await prisma.tag.update({
    where: { id: tags[2].id },
    data: { postCount: 1 }, // Lifestyle tag used in 1 post
  });

  await prisma.tag.update({
    where: { id: tags[3].id },
    data: { postCount: 1 }, // Education tag used in 1 post
  });

  console.log("✅ Counters updated");

  console.log("🎉 Database seeding completed successfully!");
  console.log("");
  console.log("📊 Summary:");
  console.log(`   👥 Users: 4 (Admin, Moderator, Regular, Guest)`);
  console.log(`   📝 Posts: 3 (2 published, 1 draft)`);
  console.log(
    `   🏷️ Tags: 5 (Technology, Business, Lifestyle, Education, Entertainment)`
  );
  console.log(`   💬 Comments: 4 (including 1 nested)`);
  console.log(`   ❤️ Likes: 4`);
  console.log(`   👥 Groups: 2 (with members)`);
  console.log(`   🛍️ Products: 2 (Pro and Enterprise licenses)`);
  console.log(`   📦 Orders: 1 (with items and review)`);
  console.log(`   📁 Files: 2 (logo and guide)`);
  console.log(`   🔔 Notifications: 2`);
  console.log(`   🔐 Sessions: 2`);
  console.log(`   📝 System Logs: 2`);
  console.log(`   🔍 Audit Logs: 1`);
}

export default () =>
  main()
    .catch((e) => {
    console.error("❌ Error during seeding:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
