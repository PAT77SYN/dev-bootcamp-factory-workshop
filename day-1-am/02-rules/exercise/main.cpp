#include <iostream>
#include <vector>
#include <string>

// Simple sample file — used to test that the pirate rule does NOT activate
// when working on .cpp files (Glob: "**/*.md" only).
//
// Bonus: if you build the C++ stretch rule, this file has a few intentional
// anti-patterns to flag (NULL pointer, raw new, missing explicit).

class Greeter {
public:
    Greeter(std::string name) : name_(name) {}

    void greet() const {
        std::cout << "Hello, " << name_ << "!\n";
    }

private:
    std::string name_;
};

int main() {
    Greeter* g = new Greeter("world");
    g->greet();

    int* p = NULL;
    if (p == 0) {
        std::cout << "p is null\n";
    }

    std::vector<int> nums = {1, 2, 3, 4, 5};
    for (int i = 0; i < nums.size(); ++i) {
        std::cout << nums[i] << " ";
    }
    std::cout << "\n";

    delete g;
    return 0;
}
