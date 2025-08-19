# 🤝 Contributing to Prismate

Thank you for your interest in contributing to Prismate! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Code Style](#-code-style)
- [Testing](#-testing)
- [Pull Request Process](#-pull-request-process)
- [Issue Guidelines](#-issue-guidelines)
- [Release Process](#-release-process)

## 🎯 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9.0+
- Git
- A code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/prismate.git
   cd prismate
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/original-username/prismate.git
   ```

## 🛠️ Development Setup

### Install Dependencies

```bash
# Install all dependencies
pnpm install

# Install dependencies for specific workspace
pnpm --filter prismate install
pnpm --filter demo install
```

### Environment Setup

```bash
# Copy environment files
cp apps/demo/.env.example apps/demo/.env.local

# Set up your database
cd apps/demo
pnpm prisma db push
pnpm prisma generate
```

### Development Commands

```bash
# Start development server for all packages
pnpm dev

# Start specific package
pnpm --filter prismate dev
pnpm --filter demo dev

# Build all packages
pnpm build

# Run linting
pnpm lint

# Run type checking
pnpm check-types

# Run tests
pnpm test
```

## 📝 Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer type imports: `import type { Component } from 'react'`
- Use explicit return types for public functions
- Avoid `any` type - use `unknown` or proper types
- Use interfaces for object shapes, types for unions/primitives

### React

- Use functional components with hooks
- Prefer named exports over default exports
- Use proper prop types and interfaces
- Follow React best practices and patterns

### File Naming

- Use kebab-case for file names: `user-profile.tsx`
- Use PascalCase for component names: `UserProfile`
- Use camelCase for function names: `getUserData`

### Import Organization

```typescript
// 1. External libraries
import React from 'react';
import { z } from 'zod';

// 2. Internal imports (absolute paths)
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

// 3. Relative imports
import { UserCard } from './user-card';
import type { User } from '../types';

// 4. Type imports
import type { ComponentProps } from 'react';
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test user.test.ts
```

### Writing Tests

- Write tests for all new functionality
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies appropriately
- Test both success and error cases

### Test Structure

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      // Arrange
      const userData = { name: 'John', email: 'john@example.com' };
      
      // Act
      const result = await userService.createUser(userData);
      
      // Assert
      expect(result).toMatchObject(userData);
    });

    it('should throw error with invalid data', async () => {
      // Arrange
      const invalidData = { name: '', email: 'invalid-email' };
      
      // Act & Assert
      await expect(userService.createUser(invalidData))
        .rejects.toThrow('Invalid user data');
    });
  });
});
```

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure your code follows the style guidelines**
2. **Write or update tests** for new functionality
3. **Update documentation** if needed
4. **Test your changes** thoroughly

### Creating a Pull Request

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes** and commit them:
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

3. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```

4. **Create a Pull Request** on GitHub

### Pull Request Guidelines

- **Use conventional commit messages** in your commits
- **Provide a clear description** of what the PR does
- **Include screenshots** for UI changes
- **Link related issues** using `Closes #123` or `Fixes #123`
- **Request reviews** from maintainers

### Conventional Commits

```bash
# Format: type(scope): description

feat(admin): add user management panel
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
style(ui): improve button component spacing
refactor(core): simplify database connection logic
test(api): add user creation tests
chore(deps): update dependencies to latest versions
```

## 🐛 Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check the documentation** for solutions
3. **Try to reproduce** the issue locally

### Issue Template

```markdown
## Bug Report

### Description
A clear description of what the bug is.

### Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

### Expected Behavior
What you expected to happen.

### Actual Behavior
What actually happened.

### Environment
- OS: [e.g. macOS 14.0]
- Node.js: [e.g. 18.17.0]
- Prismate: [e.g. 0.1.0]
- Database: [e.g. PostgreSQL 15]

### Additional Context
Add any other context, screenshots, or logs.
```

## 🚀 Release Process

### Version Management

We use [Semantic Versioning](https://semver.org/) for releases:

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Steps

1. **Update version** in `package.json` files
2. **Update CHANGELOG.md** with new features/fixes
3. **Create release branch** from `main`
4. **Run tests** to ensure everything works
5. **Build packages** and verify
6. **Create GitHub release** with release notes
7. **Merge to main** and tag the release

### Changelog Format

```markdown
## [0.2.0] - 2024-01-15

### Added
- New admin panel customization options
- Support for custom field types
- File upload functionality

### Changed
- Improved performance for large datasets
- Updated UI components to latest shadcn/ui

### Fixed
- Resolved authentication redirect issue
- Fixed table sorting in mobile view
```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Documentation](https://react.dev)

## 🆘 Need Help?

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Discord**: Join our community server (link in README)
- **Email**: support@prismate.dev

## 🙏 Thank You

Thank you for contributing to Prismate! Your contributions help make this project better for everyone in the community.

---

**Happy coding! 🎉** 