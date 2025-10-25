// File: rehype-remove-pre-tabindex.mjs
import visit from 'unist-util-visit'; // Default import

/**
 * Rehype plugin to remove tabindex attribute from <pre> elements.
 */
export default function rehypeRemovePreTabindex() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'pre' && node.properties) {
         // More robust check and deletion for both cases
         if ('tabIndex' in node.properties) {
             delete node.properties.tabIndex;
         }
         if ('tabindex' in node.properties) {
             delete node.properties.tabindex;
         }
      }
    });
  };
}