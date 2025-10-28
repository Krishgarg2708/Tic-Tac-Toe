import tkinter as tk
from tkinter import messagebox

class TicTacToe:
    def __init__(self, root):
        self.root = root
        self.root.title('Tic Tac Toe')
        self.player = 'X'
        self.board = ['']*9
        self.buttons = []
        self.create_board()

    def create_board(self):
        for i in range(9):
            b = tk.Button(self.root, text='', font=('Arial',20), width=5, height=2, command=lambda i=i: self.move(i))
            b.grid(row=i//3, column=i%3)
            self.buttons.append(b)

    def move(self, i):
        if self.board[i]=='':
            self.board[i]=self.player
            self.buttons[i].config(text=self.player)
            if self.check_winner():
                messagebox.showinfo('Game Over', f'Player {self.player} wins!'); self.reset()
            elif '' not in self.board:
                messagebox.showinfo('Game Over','Draw'); self.reset()
            else:
                self.player = 'O' if self.player=='X' else 'X'

    def check_winner(self):
        wins = [(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]
        for a,b,c in wins:
            if self.board[a]==self.board[b]==self.board[c] != '': return True
        return False

    def reset(self):
        self.player='X'; self.board=['']*9
        for b in self.buttons: b.config(text='')

if __name__=='__main__':
    root=tk.Tk(); TicTacToe(root); root.mainloop()
