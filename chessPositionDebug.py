mine = ["h1g1", "469", "g5h3", "380", "g5f3", "418", "g5e4", "456", "g5e6", "478", "g5h7", "393", "g5f7", "469", "b1c3", "507", "b1a3", "469", "h2h3", "451", "h2h4", "488", "g2g3", "488", "g2g4", "471", "f2f3", "451", "f2f4", "470", "e2e3", "639", "e2e4", "622", "d2d3", "565", "d2d4", "585", "c2c3", "488", "c2c4", "508", "b2b3", "488", "b2b4", "489", "a2a3", "450", "a2a4", "488"]
stockfish = "a2a3: 450 b2b3: 488 c2c3: 488 d2d3: 565 e2e3: 639 f2f3: 451 g2g3: 488 h2h3: 451 a2a4: 488 b2b4: 489 c2c4: 508 d2d4: 585 e2e4: 622 f2f4: 470 g2g4: 471 h2h4: 488 b1a3: 469 b1c3: 507 g5f3: 418 g5h3: 380 g5e4: 456 g5e6: 478 g5f7: 469 g5h7: 393 h1g1: 469"
stockfish = stockfish.replace(':', '')
stockfish = stockfish.split(' ')
duplicates = []

print('\n')

for i in range(0, len(stockfish), 2):
    if stockfish[i] in mine:
        holder = mine.index(stockfish[i])
        if stockfish[i+1] == mine[holder+1]:
            #print('same number of positions')
            pass
        else:
            val = int(stockfish[i+1]) - int(mine[holder+1])
            print(stockfish[i], '\n\nhas', val, 'more positions than array - ERROR\n')
        
        duplicates.append(mine[holder])
        mine.pop(holder)
        mine.pop(holder)

        if stockfish[i] in mine:
            print(stockfish[i], '\n\nin array more than once - ERROR\n')
            
        
    else:
        print(stockfish[i], '\n\nwas not found in array - ERROR\n')

for i in range(0, len(mine), 2):
    if mine[i] not in duplicates:
        print(mine[i], '\n\nwas not found in stockfish array - ERROR\n')