#!/usr/bin/python

from common import *

class Bomb_Placement:
    def __init__(self, original_position, force):
        self.original_position = original_position.replace("B", "X")
        self.transitional_state = self.original_position
        self.force = force
    
    def move_to_position(self, thing_to_move, new_position):
        if new_position < 0 or new_position > len(self.transitional_state) - 1:
            pass
        elif self.transitional_state[new_position] == "." or self.transitional_state[new_position] == thing_to_move:
            self.transitional_state[new_position] = thing_to_move
        else:
            self.transitional_state[new_position] = "X"

    def move_lt(self, position):
        self.move_to_position("<", position - self.force)

    def move_gt(self, position):
        self.move_to_position(">", position + self.force)

    def get_current_state(self):
        return "".join(self.transitional_state)

    def is_done(self):
        return all([False for x in ["<",">","X","B"] if x in self.get_current_state()])
    
    def iterate(self):
        self.original_position = self.transitional_state
        self.transitional_state = list("." * len(self.original_position))
        
        for position in range(0, len(self.transitional_state)):
            current = self.original_position[position]
            if current == "<":
                self.move_lt(position)
            elif current == ">":
                self.move_gt(position)
            elif current == "X":
                self.move_lt(position)
                self.move_gt(position)

def explode(bomb_placement, force):
    answer = [bomb_placement]
    force = int(force)

    placement = Bomb_Placement(bomb_placement, force)
    
    while not placement.is_done():
        placement.iterate()
        answer.append(placement.get_current_state())

    return answer

def main():
    tests = {("..B....", 2): ["..B....", "<...>..", "......>", "......."],
             ("..B.B..B", 10): ["..B.B..B", "........"],
             ("B.B.B.BB.", 2): ["B.B.B.BB.", "<.X.X<>.>", "<.<<>.>.>", "<<....>.>", "........>", "........."],
             ("..B.B..B", 1): ["..B.B..B", ".<.X.><.", "<.<.><>.", ".<..<>.>", "<..<..>.", "..<....>", ".<......", "<.......", "........"],
             ("..B.BB..B.B..B...", 1): ["..B.BB..B.B..B...", ".<.X<>><.X.><.>..", "<.<<>.X><.><>..>.", ".<<..X.X>.<>.>..>", "<<..<.X.>X..>.>..", "<..<.<.><>>..>.>.", "..<.<..<>.>>..>.>", ".<.<..<..>.>>..>.", "<.<..<....>.>>..>", ".<..<......>.>>..", "<..<........>.>>.", "..<..........>.>>", ".<............>.>", "<..............>.", "................>", "................."]}

    def adapter(args): return explode(args[0], args[1])

    run(adapter, tests, """USAGE: %s \"bomb placement\" force or test""", 2)
    

if __name__ == '__main__':
    main()
