#include "parser.h"

#include <stdexcept>
#include <string>
#include <utility>

#include "lexer.h"

namespace calc {

namespace {

// Recursive-descent parser holding a peeked token. Grammar:
//   expr   -> term   (('+' | '-') term)*
//   term   -> factor (('*' | '/') factor)*
//   factor -> NUMBER
class Parser {
   public:
    explicit Parser(std::string_view source) : lexer_(source) {
        current_ = lexer_.next();
    }

    NodePtr parse_expr() {
        NodePtr left = parse_term();
        while (current_.type == TokenType::PLUS ||
               current_.type == TokenType::MINUS) {
            BinOp op =
                (current_.type == TokenType::PLUS) ? BinOp::Add : BinOp::Sub;
            advance();
            NodePtr right = parse_term();
            left = make_binary(op, std::move(left), std::move(right));
        }
        return left;
    }

    void expect_end() {
        if (current_.type != TokenType::END) {
            throw std::runtime_error(
                std::string("unexpected token ") +
                token_type_name(current_.type) + " at position " +
                std::to_string(current_.pos) + " (expected end of input)");
        }
    }

   private:
    Lexer lexer_;
    Token current_;

    void advance() { current_ = lexer_.next(); }

    NodePtr parse_term() {
        NodePtr left = parse_factor();
        while (current_.type == TokenType::STAR ||
               current_.type == TokenType::SLASH) {
            BinOp op =
                (current_.type == TokenType::STAR) ? BinOp::Mul : BinOp::Div;
            advance();
            NodePtr right = parse_factor();
            left = make_binary(op, std::move(left), std::move(right));
        }
        return left;
    }

    NodePtr parse_factor() {
        if (current_.type != TokenType::NUMBER) {
            throw std::runtime_error(
                std::string("expected NUMBER but got ") +
                token_type_name(current_.type) + " at position " +
                std::to_string(current_.pos));
        }
        auto node = std::make_unique<Node>();
        node->kind = NodeKind::Number;
        node->value = current_.value;
        advance();
        return node;
    }

    static NodePtr make_binary(BinOp op, NodePtr left, NodePtr right) {
        auto node = std::make_unique<Node>();
        node->kind = NodeKind::BinaryOp;
        node->op = op;
        node->left = std::move(left);
        node->right = std::move(right);
        return node;
    }
};

}  // namespace

NodePtr parse(std::string_view source) {
    Parser parser(source);
    NodePtr root = parser.parse_expr();
    parser.expect_end();
    return root;
}

}  // namespace calc
