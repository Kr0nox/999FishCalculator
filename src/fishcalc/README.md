This folder contains code from [stardew-fishing-calc](https://github.com/brokencygnus/stardew-fishing-calc), licensed under the GNU General Public License v3.0.
Modifications have been made by [Kronox](https://www.github.com/Kr0nox) in 2025.
All modified code remains under GPLv3.

Summary of changes:

- Added full type safety
- Formatting
- Removed dependency on lodash and use own deep equal for the one use case
- Extracted useEffect expressions from home page to functions in index.ts
- Removed unused functions
- Made all declarations that can be const const
- replaced recursiveMultiply with a function that already sums up the elements internally called summedRecursiveMultiply
  - for each use of a result from recursiveMultiply (which returns number[][]) only the sum of elements in each array and the amount of elements are needed in sub methods. This new method directly performs these calculations. Due to that we can take some shortcuts. We directly calculate the sums and not each array element, making it much less time and space heavy. The number of elements gets calculated over the binomial coefficient.
