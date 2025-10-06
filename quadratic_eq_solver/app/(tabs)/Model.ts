// Model (should not be in app/tabs, but for this deliverable i will leave it here :) )
export class QuadraticEquationModel {
  solve(
    a: number,
    b: number,
    c: number
  ): {
    root1: string;
    root2: string;
    message: string;
    isError: boolean;
  } {
    const delta = b * b - 4 * a * c;

    const result: {
      root1: string;
      root2: string;
      message: string;
      isError: boolean;
    } = {
      root1: "N/A",
      root2: "N/A",
      message: "",
      isError: false,
    };

    if (a === 0) {
      result.message =
        "A quadratic equation must have a non-zero quadratic-coefficient";
      result.isError = true;
      return result;
    }

    if (delta < 0) {
      const absDelta = Math.abs(delta);
      const real_root = -b / (2 * a);
      const imaginary_root = Math.sqrt(absDelta) / (2 * a);
      const root1 = `${real_root.toFixed(4)} + ${imaginary_root.toFixed(4)}i`;
      const root2 = `${real_root.toFixed(4)} - ${imaginary_root.toFixed(4)}i`;

      result.root1 = root1;
      result.root2 = root2;
      result.message = "Successful!";
      return result;
    } else {
      const root1 = (-b + Math.sqrt(delta)) / (2 * a);
      const root2 = (-b - Math.sqrt(delta)) / (2 * a);
      result.root1 = root1.toFixed(4);
      result.root2 = root2.toFixed(4);
      result.message = "Successful!";
      return result;
    }
  }
}
