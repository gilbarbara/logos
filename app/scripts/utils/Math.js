module.exports = {
    expr (expr) {

        var chars = expr.split('');
        var n = [], op = [], index = 0, oplast = true;

        n[index] = '';

        // Parse the expression
        for (var c = 0; c < chars.length; c++) {

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
        for (var o = 0; o < op.length; o++) {
            var num = parseFloat(n[o + 1]);

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
