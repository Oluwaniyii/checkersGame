# CheckersGame

Dedicated repo for checkersLounge bare game logic

![Untitled](https://res.cloudinary.com/longbotton-cloudinary/image/upload/v1666348749/projectfiles/checkersLounge/ezgif.com-gif-maker_f7SQuHqP4_nboafh.gif)

<br />

## Branches

<u><h3> checkerslogic_plain</h3></u>

This branch uses the old minimal ui , this is to focus on the bare game logic, game performance and for easier introduction of new functionalities

<img src="https://res.cloudinary.com/longbotton-cloudinary/image/upload/v1667302126/projectfiles/checkersLounge/Screenshot_565_wovn3j.png" alt="checkersgame plain" />

<u><h3> checkerslogic_interface</h3></u>

This on the other hand is concentrated on implementing updated game logic to preferred fancy interface before shipping to the main product

<img src="https://res.cloudinary.com/longbotton-cloudinary/image/upload/v1666350039/projectfiles/checkersLounge/Screenshot_495_b6cr8l.png" alt="checkersgame fancy ui" />

<br />
<br />
<br />

# Game Logic

## Checkers

Checkers or Draught is played by two opponents on opposite sides of the game board. One player has dark pieces, the other has light pieces. The players alternate turns. A player cannot move an opponent's pieces.

A move consists of moving a piece diagonally to an adjacent unoccupied square. If the adjacent square contains an opponent's piece, and the square immediately beyond it is vacant, the piece may be captured (and removed from the board) by jumping over it

Only the dark squares of the checkerboard are used. When capturing an opponent's piece is possible, capturing is mandatory.

The player with no pieces remaining, or who cannot move due to being blocked, loses the game.

![Untitled](https://res.cloudinary.com/longbotton-cloudinary/image/upload/v1667300616/projectfiles/checkersLounge/Untitled_jwp0l4.png)

<br />

### Background

This game is built on [Ryan Branco](https://medium.com/@ryanbr23?source=post_page-----ecd562f985c2--------------------------------)‘s blog on [Checkers Game](https://levelup.gitconnected.com/creating-a-board-game-checkers-with-javascript-ecd562f985c2). It only consists of a simple move and jump, but without it, I may never know what to begin with. His approach to creating the initial game state was amazing.

This is not a full detail on the game logic, I may create blog tutorials later on but this should be enough to help you understand what’s going on in the code

<br />

### **The game board**

A checkers board is usually square, that is x by x and the possible longest diagonal row is always x. That is the diagonal row **from the top right cell** to **the bottom left cell**

The current game board is 8 by 8, i.e. 8 cells per row, and 64 cells in total, and the possible longest diagonal row is 8

![Untitled](https://res.cloudinary.com/longbotton-cloudinary/image/upload/v1667300617/projectfiles/checkersLounge/Untitled_1_nu5jrs.png)

<br />

### **Pawn Basic Move**

A basic move is achieved by moving diagonally toward the right or left, this is calculated by adding **7** or **9** to the current cell position of the piece respectively.

Basically, it’s derived by **deducting** 1 from and **adding** 1 to the number of cells in a row, (**boardRow - 1**, **boardRow + 1**) respectively (would vary depending on board size)

![Untitled](https://res.cloudinary.com/longbotton-cloudinary/image/upload/v1667300620/projectfiles/checkersLounge/Untitled_2_g9hb8w.png)

<br />

### **Pawn Basic Jump**

A Jump is possible if the next diagonal space is occupied by an enemy piece and immediately followed by an open space

![Untitled](https://res.cloudinary.com/longbotton-cloudinary/image/upload/v1667300621/projectfiles/checkersLounge/Untitled_3_zbc0j7.png)

In this case, we could say a right jump is possible if the next **7th** space is occupied by an enemy piece and the next **14th** space is available.

- **Left Jump**: 7th, 14th,
- **Right Jump**: 9th, 18th

<br />

**Reverse Jump:** A reverse jump is supported in this game and is very similar to a normal jump, just that you **subtract** instead of **adding** to calculate the possibility

**Multiple Jumps:** After a complete jump is made instead of switching turns, we simply check for another possible jump on the same piece. If another jump is possible, we grant it otherwise, we switch to the other player’s turn and carry on

**PLEASE** **NOTE!**

We have **64** **cells** altogether, the first cell i.e. the **cell** on the top left has an index of **0** and the last cell on the right bottom has an index of **63**

Concerning every move and jump, the **forward** move of a red piece is calculated as **moving toward 64**, and the **reverse** is calculated as **moving toward 0**. While a black piece **forward** **moves towards 0** and **reverse** **moves towards 64**. Keep this in mind.

![Untitled](https://res.cloudinary.com/longbotton-cloudinary/image/upload/v1667300616/projectfiles/checkersLounge/Untitled_4_yfg9bj.png)

<br />

### The King Piece

A king is a rather more complex character than the pawn, The king can move in all directions i.e. (right, left, reverse right, and reverse left) or [7, -7. 9, -9] . A king can move over multiple spaces until there is a **[block](https://www.notion.so/Checkers-Game-44e4a5eac6e84d00aba24c4af3b8db34)**.

**The king Move:** A king can move from one diagonal end to anothe**r.** The maximum diagonal row our board can have is 8. Hence we assume a king can move to the max of the 8th multiplication of a given direction until there is a block

![Untitled](https://res.cloudinary.com/longbotton-cloudinary/image/upload/v1667300627/projectfiles/checkersLounge/Untitled_5_kqp6ry.png)

**The king Jump:** The king jump is quite tricky too.

- An enemy piece doesn’t have to be immediately next to the king piece i.e. it can detect and make a long-range jump
- The king piece can choose to land in any space (after the enemy piece) along the jump direction row

![Untitled](https://res.cloudinary.com/longbotton-cloudinary/image/upload/v1667300632/projectfiles/checkersLounge/Untitled_6_km2dd3.png)

**The king Multiple Jump:**
Since a king can land anywhere after the enemy piece, this kind of puts a strain on multiple jumps. so to work around this we have to detect if a king is multiple jumps from onset then on select, we then only set multiple jump cells active, this way we can force a king piece to multiple jumps

To detect multiple jumps, we have to check each cell after the enemy piece for possible multiple jumps

![Untitled](https://res.cloudinary.com/longbotton-cloudinary/image/upload/v1667300633/projectfiles/checkersLounge/Untitled_7_xebk1x.png)

<br />

### Block

A block is a situation where a piece cannot move or jump forward. A block is detected when either there is an ally piece in the next possible space or an enemy piece with no space behind for a jump

## Contribution

All of the approaches to various characters and behaviours are only suggestions, not definitive reasoning. A better proposal or method would be greatly appreciated.

## Features

- Piece Move
- Piece Jump / Multiple Jumps
- King piece move, jump and multiple jumps

## Game Logic
