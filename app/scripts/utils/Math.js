module.exports = {
    expr (expr) {

        let chars  = expr.split(''),
            n      = [],
            op     = [],
            index  = 0,
            oplast = true;

        n[index] = '';

        // Parse the expression
        for (let c = 0; c < chars.length; c++) {

            if (isNaN(parseInt(chars[c], 10)) && chars[c] !== '.' && !oplast) {
                op[index] = chars[c];
                index++;
                n[index] = '';
                oplast = true;
            }
            else {
                n[index] += chars[c];
                oplast = false;
            }
        }

        // Calculate the expression
        expr = parseFloat(n[0]);
        for (let o = 0; o < op.length; o++) {
            let num = parseFloat(n[o + 1]);

            switch (op[o]) {
                case '+':
                    expr = expr + num;
                    break;
                case '-':
                    expr = expr - num;
                    break;
                case '*':
                    expr = expr * num;
                    break;
                case '/':
                    expr = expr / num;
                    break;
                default:
                    break;
            }
        }

        return expr;
    }
};
