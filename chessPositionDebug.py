mine = ["g1h1", "2211", "f1e1", "2035", "f1d1", "2034", "f1c1", "1990", "f1b1", "1944", "a1a2", "1854", "a1b1", "1943", "a1c1", "1899", "a1d1", "1853", "a1e1", "1764", "h2h3", "2163", "h2h4", "2034", "g2g3", "2075", "e2e1", "1944", "e2e3", "2121", "e2d2", "2079", "e2d1", "1897", "b2b3", "1943", "b2b4", "2027", "f3h4", "2045", "f3e1", "1769", "f3d2", "2002", "f3d4", "2293", "f3e5", "2403", "d3d4", "2202", "c3d1", "1674", "c3b1", "1719", "c3a2", "1897", "c3a4", "1944", "c3d5", "2030", "c3b5", "1986", "a3a4", "2076", "c4d5", "1951", "c4e6", "2093", "c4f7", "165", "c4b3", "1947", "c4a2", "1944", "c4b5", "1915", "c4a6", "1943", "g5h4", "1898", "g5h6", "2065", "g5f4", "2205", "g5e3", "2114", "g5d2", "2026", "g5c1", "1841", "g5f6", "1933"]
stockfish = "b2b3: 1943 g2g3: 2075 h2h3: 2163 a3a4: 2076 d3d4: 2202 b2b4: 2027 h2h4: 2034 c3b1: 1719 c3d1: 1674 c3a2: 1897 c3a4: 1944 c3b5: 1986 c3d5: 2030 f3e1: 1769 f3d2: 2002 f3d4: 2293 f3h4: 2045 f3e5: 2403 c4a2: 1944 c4b3: 1947 c4b5: 1915 c4d5: 1951 c4a6: 1943 c4e6: 2093 c4f7: 165 g5c1: 1841 g5d2: 2026 g5e3: 2114 g5f4: 2205 g5h4: 1898 g5f6: 1933 g5h6: 2065 a1b1: 1943 a1c1: 1899 a1d1: 1853 a1e1: 1764 a1a2: 1854 f1b1: 1944 f1c1: 1990 f1d1: 2034 f1e1: 2035 e2d1: 1897 e2e1: 1944 e2d2: 2079 e2e3: 2121 g1h1: 2211"
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