#include "evaluator.h"

#include <stdexcept>

namespace calc {

std::int64_t evaluate(const Node& node) {
    switch (node.kind) {
        case NodeKind::Number:
            return node.value;

        case NodeKind::BinaryOp: {
            const std::int64_t left = evaluate(*node.left);
            const std::int64_t right = evaluate(*node.right);
            switch (node.op) {
                case BinOp::Add:
                    return left + right;
                case BinOp::Sub:
                    return left - right;
                case BinOp::Mul:
                    return left * right;
                case BinOp::Div:
                    if (right == 0) {
                        throw std::runtime_error("division by zero");
                    }
                    return left / right;
            }
        }
    }
    throw std::runtime_error("evaluator: unknown node kind");
}

}  // namespace calc
