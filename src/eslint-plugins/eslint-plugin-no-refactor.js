
/**
 * @fileoverview ESLint plugin to prevent refactoring of specific components
 */

// List of components that should not be refactored
const DO_NOT_REFACTOR_COMPONENTS = [
  'AIGenerationDropdownButton'
];

module.exports = {
  rules: {
    'no-component-refactor': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Prevent refactoring of specific components',
          category: 'Best Practices',
          recommended: true,
        },
        messages: {
          noRefactor: "This component ({{ name }}) should not be refactored or split into smaller components as noted in documentation."
        },
      },
      create(context) {
        return {
          // Check import statements that might be extracting parts of protected components
          ImportDeclaration(node) {
            if (node.source.value.includes('/components/sandbox/')) {
              // Check for destructured imports from protected components
              const importPath = node.source.value;
              
              // If someone is trying to import specific parts from a protected component file
              if (node.specifiers && node.specifiers.length > 0) {
                for (const component of DO_NOT_REFACTOR_COMPONENTS) {
                  if (importPath.includes(component) && node.specifiers.some(s => s.type === 'ImportSpecifier')) {
                    context.report({
                      node,
                      messageId: 'noRefactor',
                      data: { name: component }
                    });
                  }
                }
              }
            }
          },

          // Check JSX usage to ensure protected components are used as a whole
          JSXElement(node) {
            if (node.openingElement && node.openingElement.name && node.openingElement.name.name) {
              const componentName = node.openingElement.name.name;
              
              // Check if someone is creating a component that tries to replace part of a protected component
              for (const protectedComponent of DO_NOT_REFACTOR_COMPONENTS) {
                if (componentName.includes(protectedComponent) && componentName !== protectedComponent) {
                  context.report({
                    node,
                    messageId: 'noRefactor',
                    data: { name: protectedComponent }
                  });
                }
              }
            }
          },
        };
      },
    },
  },
};
