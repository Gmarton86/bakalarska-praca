import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native'
import BackButton from '../utils/backButton'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import CustomButton from '../utils/customButton'
import SQLite from 'react-native-sqlite-storage'

const db = SQLite.openDatabase(
  {
    name: 'LoginDB',
    location: 'default',
    createFromLocation: '../db/LoginDB.db',
  },
  () => {},
  (error) => {
    console.log(error)
  }
)

export default function Register({ navigation }) {
  const [players, setPlayers] = useState([
    { Name: 'Dalibor', Username: 'Diko', DateOfBirth: 2001, Rank: 1 },
    { Name: 'Jaromír', Username: 'Truksa', DateOfBirth: 0, Rank: 2 },
    { Name: 'Tibor', Username: 'Bednár', DateOfBirth: 0, Rank: 3 },
    { Name: 'Tomáš', Username: 'Staš', DateOfBirth: 0, Rank: 4 },
    { Name: 'Jakub', Username: 'Kuloštiak', DateOfBirth: 0, Rank: 5 },
    { Name: 'Zdeno', Username: 'Drbiak', DateOfBirth: 0, Rank: 6 },
    { Name: 'Marek', Username: 'Tutura', DateOfBirth: 0, Rank: 7 },
    { Name: 'Milan', Username: 'Staš', DateOfBirth: 0, Rank: 8 },
    { Name: 'Juraj', Username: 'Teplanský', DateOfBirth: 0, Rank: 9 },
    { Name: 'Martin', Username: 'Makúch', DateOfBirth: 0, Rank: 10 },
    { Name: 'Emil', Username: 'Kajánek', DateOfBirth: 0, Rank: 11 },
    { Name: 'Maroš', Username: 'Ferneza', DateOfBirth: 0, Rank: 12 },
    { Name: 'Jaroslav', Username: 'Cagáň', DateOfBirth: 0, Rank: 13 },
    { Name: 'Miroslav', Username: 'Bednár', DateOfBirth: 0, Rank: 14 },
    { Name: 'Ervín', Username: 'Dedinský', DateOfBirth: 0, Rank: 15 },
    { Name: 'Ján', Username: 'Žiak', DateOfBirth: 0, Rank: 16 },
    { Name: 'Jaroslav', Username: 'Špavor', DateOfBirth: 0, Rank: 17 },
    { Name: 'Martin', Username: 'Briš', DateOfBirth: 0, Rank: 18 },
    { Name: 'Jakub', Username: 'Michalčík', DateOfBirth: 0, Rank: 19 },
    { Name: 'Richard', Username: 'Kolenčík', DateOfBirth: 0, Rank: 20 },
    { Name: 'Lukáš', Username: 'Rabčan', DateOfBirth: 0, Rank: 21 },
    { Name: 'Samuel', Username: 'Sládek', DateOfBirth: 0, Rank: 22 },
    { Name: 'Michal', Username: 'Murín', DateOfBirth: 0, Rank: 23 },
    { Name: 'Ján', Username: 'Argaláš', DateOfBirth: 0, Rank: 24 },
    { Name: 'Pavol', Username: 'Karlík', DateOfBirth: 0, Rank: 25 },
    { Name: 'Róbert', Username: 'Hruška', DateOfBirth: 0, Rank: 26 },
    { Name: 'Martin', Username: 'Kolenčík', DateOfBirth: 0, Rank: 27 },
    { Name: 'Šimon', Username: 'Gemeľa', DateOfBirth: 0, Rank: 28 },
    { Name: 'Jozef', Username: 'Žitňak', DateOfBirth: 0, Rank: 29 },
    { Name: 'Pavol', Username: 'Grobarčík', DateOfBirth: 0, Rank: 30 },
    { Name: 'Michal', Username: 'Zdražila', DateOfBirth: 0, Rank: 31 },
    { Name: 'Ján', Username: 'Kupčulík', DateOfBirth: 0, Rank: 32 },
    { Name: 'Patrik', Username: 'Balák', DateOfBirth: 0, Rank: 33 },
    { Name: 'Ján', Username: 'Buczacki', DateOfBirth: 0, Rank: 34 },
    { Name: 'Peter', Username: 'Farský', DateOfBirth: 0, Rank: 35 },
    { Name: 'Marcin', Username: 'Lowas', DateOfBirth: 0, Rank: 36 },
    { Name: 'Jozef', Username: 'Kozák', DateOfBirth: 0, Rank: 37 },
    { Name: 'Patrik', Username: 'Zrnčík', DateOfBirth: 0, Rank: 38 },
    { Name: 'Andrej', Username: 'Hanko', DateOfBirth: 0, Rank: 39 },
    { Name: 'Denis', Username: 'Lech', DateOfBirth: 0, Rank: 40 },
    { Name: 'Jaroslav', Username: 'Žuffa', DateOfBirth: 0, Rank: 41 },
    { Name: 'Anton', Username: 'Borovka', DateOfBirth: 0, Rank: 42 },
    { Name: 'Jaroslav', Username: 'Kačník', DateOfBirth: 0, Rank: 43 },
    { Name: 'Martin', Username: 'Maslan', DateOfBirth: 0, Rank: 44 },
    { Name: 'Jozef', Username: 'Janckulík', DateOfBirth: 0, Rank: 45 },
    { Name: 'Ladislav', Username: 'Zajac', DateOfBirth: 0, Rank: 46 },
    { Name: 'Július', Username: 'Sitár', DateOfBirth: 0, Rank: 47 },
    { Name: 'Anton', Username: 'Juritka', DateOfBirth: 0, Rank: 48 },
    { Name: 'Karol', Username: 'Sklarčík', DateOfBirth: 0, Rank: 49 },
    { Name: 'Ivan', Username: 'Kováč', DateOfBirth: 0, Rank: 50 },
    { Name: 'Štefan', Username: 'Gemeľa', DateOfBirth: 0, Rank: 51 },
    { Name: 'Martin', Username: 'Zmrazek', DateOfBirth: 0, Rank: 52 },
    { Name: 'Marián', Username: 'Gabarík', DateOfBirth: 0, Rank: 53 },
    { Name: 'Ladislav', Username: 'Tomáň', DateOfBirth: 0, Rank: 54 },
    { Name: 'Rastislav', Username: 'Kožienka', DateOfBirth: 0, Rank: 55 },
    { Name: 'Milan', Username: 'Vicáň', DateOfBirth: 0, Rank: 56 },
    { Name: 'Ľudovít', Username: 'Strežo', DateOfBirth: 0, Rank: 57 },
    { Name: 'Igor', Username: 'Palider', DateOfBirth: 0, Rank: 58 },
    { Name: 'Ján', Username: 'Hudec', DateOfBirth: 0, Rank: 59 },
    { Name: 'Igor', Username: 'Janckulík', DateOfBirth: 0, Rank: 60 },
    { Name: 'Dušan', Username: 'Lupták', DateOfBirth: 0, Rank: 61 },
    { Name: 'František', Username: 'Potocký', DateOfBirth: 0, Rank: 62 },
    { Name: 'Ľubomír', Username: 'Gejdoš', DateOfBirth: 0, Rank: 63 },
    { Name: 'Radovan', Username: 'Bugan', DateOfBirth: 0, Rank: 64 },
    { Name: 'Vladimír', Username: 'Žuffa', DateOfBirth: 0, Rank: 65 },
    { Name: 'Matej', Username: 'Majchrák', DateOfBirth: 0, Rank: 66 },
    { Name: 'Robert', Username: 'Uhrík', DateOfBirth: 0, Rank: 67 },
    { Name: 'Miroslav', Username: 'Borsík', DateOfBirth: 0, Rank: 68 },
    { Name: 'Jozef', Username: 'Žuffa', DateOfBirth: 0, Rank: 69 },
    { Name: 'Peter', Username: 'Leštinský', DateOfBirth: 0, Rank: 70 },
    { Name: 'Milan', Username: 'Jašica st.', DateOfBirth: 0, Rank: 71 },
    { Name: 'Patrik', Username: 'Svetlák', DateOfBirth: 0, Rank: 72 },
    { Name: 'Ján', Username: 'Kubačka ml.', DateOfBirth: 0, Rank: 73 },
    { Name: 'Vladimír', Username: 'Karas', DateOfBirth: 0, Rank: 74 },
    { Name: 'Zdenko', Username: 'Bartoš', DateOfBirth: 0, Rank: 75 },
    { Name: 'Pavol', Username: 'Bartoš', DateOfBirth: 0, Rank: 76 },
    { Name: 'Miroslav', Username: 'Krížik', DateOfBirth: 0, Rank: 77 },
    { Name: 'Jozef', Username: 'Šamaj', DateOfBirth: 0, Rank: 78 },
    { Name: 'Milan', Username: 'Laššák', DateOfBirth: 0, Rank: 79 },
    { Name: 'František', Username: 'Ptáčin', DateOfBirth: 0, Rank: 80 },
    { Name: 'Ján', Username: 'Šmiheľ', DateOfBirth: 0, Rank: 81 },
    { Name: 'Patrik', Username: 'Svetlák', DateOfBirth: 0, Rank: 82 },
    { Name: 'Matej', Username: 'Nádašský', DateOfBirth: 0, Rank: 83 },
    { Name: 'Ján', Username: 'Repóň', DateOfBirth: 0, Rank: 84 },
    { Name: 'Ján', Username: 'Veselovský st.', DateOfBirth: 0, Rank: 85 },
    { Name: 'Radovan', Username: 'Slimák', DateOfBirth: 0, Rank: 86 },
    { Name: 'Peter', Username: 'Fendek', DateOfBirth: 0, Rank: 87 },
    { Name: 'Patrik', Username: 'Hládek', DateOfBirth: 0, Rank: 88 },
    { Name: 'Tomáš', Username: 'Chrenek', DateOfBirth: 0, Rank: 89 },
    { Name: 'Michal', Username: 'Snovák', DateOfBirth: 0, Rank: 90 },
    { Name: 'Mário', Username: 'Solár', DateOfBirth: 0, Rank: 91 },
    { Name: 'Jozef', Username: 'Barica', DateOfBirth: 0, Rank: 92 },
    { Name: 'Ján', Username: 'Martauz', DateOfBirth: 0, Rank: 93 },
    { Name: 'Tomáš', Username: 'Smolka', DateOfBirth: 0, Rank: 94 },
    { Name: 'Peter', Username: 'Dúha', DateOfBirth: 0, Rank: 95 },
    { Name: 'Jan', Username: 'Jakubů', DateOfBirth: 0, Rank: 96 },
    { Name: 'Jozef', Username: 'Vengrín', DateOfBirth: 0, Rank: 97 },
    { Name: 'Roman', Username: 'Kolenčík', DateOfBirth: 0, Rank: 98 },
    { Name: 'Lukáš', Username: 'Džubek', DateOfBirth: 0, Rank: 99 },
    { Name: 'Adam', Username: 'Matejčík', DateOfBirth: 0, Rank: 100 },
    { Name: 'Marek', Username: 'Minarech', DateOfBirth: 0, Rank: 101 },
    { Name: 'Miroslav', Username: 'Fačko', DateOfBirth: 0, Rank: 102 },
    { Name: 'Norbert', Username: 'Molnár', DateOfBirth: 0, Rank: 103 },
    { Name: 'Juraj', Username: 'Migra', DateOfBirth: 0, Rank: 104 },
    { Name: 'Jakub', Username: 'Šprlák', DateOfBirth: 0, Rank: 105 },
    { Name: 'Ján', Username: 'Baranec', DateOfBirth: 0, Rank: 106 },
    { Name: 'Vladimír', Username: 'Kakačka', DateOfBirth: 0, Rank: 107 },
    { Name: 'Ján', Username: 'Habľák', DateOfBirth: 0, Rank: 108 },
    { Name: 'Peter', Username: 'Beňuš', DateOfBirth: 0, Rank: 109 },
    { Name: 'Juraj', Username: 'Durčák', DateOfBirth: 0, Rank: 110 },
    { Name: 'Jozef', Username: 'Mišánik', DateOfBirth: 0, Rank: 111 },
    { Name: 'Martin', Username: 'Kyseľ st.', DateOfBirth: 0, Rank: 112 },
    { Name: 'Ján', Username: 'Zrnčík st.', DateOfBirth: 0, Rank: 113 },
    { Name: 'Jozef', Username: 'Pšenák', DateOfBirth: 0, Rank: 114 },
    { Name: 'Tomáš', Username: 'Belvončík', DateOfBirth: 0, Rank: 115 },
    { Name: 'Václav', Username: 'Kotúľ', DateOfBirth: 0, Rank: 116 },
    { Name: 'Roman', Username: 'Záhora', DateOfBirth: 0, Rank: 117 },
    { Name: 'Róbert', Username: 'Kajan', DateOfBirth: 0, Rank: 118 },
    { Name: 'Juraj', Username: 'Jurík', DateOfBirth: 0, Rank: 119 },
    { Name: 'Milan', Username: 'Jašica ml.', DateOfBirth: 0, Rank: 120 },
    { Name: 'Ján', Username: 'Trnka', DateOfBirth: 0, Rank: 121 },
    { Name: 'Dávid', Username: 'Planieta', DateOfBirth: 0, Rank: 122 },
    { Name: 'Damián', Username: 'Kocúr', DateOfBirth: 0, Rank: 123 },
    { Name: 'Ján', Username: 'Beňuš', DateOfBirth: 0, Rank: 124 },
    { Name: 'Vladimír', Username: 'Macko ml.', DateOfBirth: 0, Rank: 125 },
    { Name: 'Miloš', Username: 'Žuffa', DateOfBirth: 0, Rank: 126 },
    { Name: 'Damián', Username: 'Makúch', DateOfBirth: 0, Rank: 127 },
    { Name: 'Dávid', Username: 'Kováľ', DateOfBirth: 0, Rank: 128 },
    { Name: 'Marián', Username: 'Veselovský', DateOfBirth: 0, Rank: 129 },
    { Name: 'Jozef', Username: 'Betík', DateOfBirth: 0, Rank: 130 },
    { Name: 'Dávid', Username: 'Hnilický', DateOfBirth: 0, Rank: 131 },
    { Name: 'Wojciech', Username: 'Klucz', DateOfBirth: 0, Rank: 132 },
    { Name: 'Daniel', Username: 'Ťapák', DateOfBirth: 0, Rank: 133 },
    { Name: 'Miloš', Username: 'Kubáň', DateOfBirth: 0, Rank: 134 },
    { Name: 'Ľuboš', Username: 'Baľák', DateOfBirth: 0, Rank: 135 },
    { Name: 'Ján', Username: 'Zaťka', DateOfBirth: 0, Rank: 136 },
    { Name: 'David', Username: 'Romaňák', DateOfBirth: 0, Rank: 137 },
    { Name: 'Adam', Username: 'Záň st.', DateOfBirth: 0, Rank: 138 },
    { Name: 'Jozef', Username: 'Hládek', DateOfBirth: 0, Rank: 139 },
    { Name: 'Jozef', Username: 'Ihring', DateOfBirth: 0, Rank: 140 },
    { Name: 'Martin', Username: 'Durčák', DateOfBirth: 0, Rank: 141 },
    { Name: 'Dušan', Username: 'Mintál', DateOfBirth: 0, Rank: 142 },
    { Name: 'Zdenko', Username: 'Nodžák', DateOfBirth: 0, Rank: 143 },
    { Name: 'Rudolf', Username: 'Kapičák st.', DateOfBirth: 0, Rank: 144 },
    { Name: 'Igor', Username: 'Matejčík', DateOfBirth: 0, Rank: 145 },
    { Name: 'Jozef', Username: 'Kovalík', DateOfBirth: 0, Rank: 146 },
    { Name: 'Venanc', Username: 'Maretta', DateOfBirth: 0, Rank: 147 },
    { Name: 'Ivan', Username: 'Zaťko', DateOfBirth: 0, Rank: 148 },
    { Name: 'Radovan', Username: 'Planieta', DateOfBirth: 0, Rank: 149 },
    { Name: 'Stanislav', Username: 'Šalata', DateOfBirth: 0, Rank: 150 },
    { Name: 'Mário', Username: 'Šprlák', DateOfBirth: 0, Rank: 151 },
    { Name: 'Stanislav', Username: 'Kubica ml.', DateOfBirth: 0, Rank: 152 },
    { Name: 'Jozef', Username: 'Kurčina', DateOfBirth: 0, Rank: 153 },
    { Name: 'Matuš', Username: 'Kojs', DateOfBirth: 0, Rank: 154 },
    { Name: 'Marek', Username: 'Kovalík', DateOfBirth: 0, Rank: 155 },
    { Name: 'Michal', Username: 'Póčik', DateOfBirth: 0, Rank: 156 },
    { Name: 'Marek', Username: 'Voška', DateOfBirth: 0, Rank: 157 },
    { Name: 'Jozef', Username: 'Sojčák', DateOfBirth: 0, Rank: 158 },
    { Name: 'Ján', Username: 'Veselovský st.', DateOfBirth: 0, Rank: 159 },
    { Name: 'Tomáš', Username: 'Makúch', DateOfBirth: 0, Rank: 160 },
    { Name: 'Stanislav', Username: 'Kubica st.', DateOfBirth: 0, Rank: 161 },
    { Name: 'Ján', Username: 'Zrnčík ml.', DateOfBirth: 0, Rank: 162 },
    { Name: 'Miroslav', Username: 'Fafejta', DateOfBirth: 0, Rank: 163 },
    { Name: 'Ján', Username: 'Šeliga ml.', DateOfBirth: 0, Rank: 164 },
    { Name: 'Pavol', Username: 'Beca', DateOfBirth: 0, Rank: 165 },
    { Name: 'Vladimír', Username: 'Zumrík', DateOfBirth: 0, Rank: 166 },
    { Name: 'Juraj', Username: 'Veselovský', DateOfBirth: 0, Rank: 167 },
    { Name: 'Peter', Username: 'Staš', DateOfBirth: 0, Rank: 168 },
    { Name: 'Ľuboš', Username: 'Voška', DateOfBirth: 0, Rank: 169 },
    { Name: 'Karol', Username: 'Santer', DateOfBirth: 0, Rank: 170 },
    { Name: 'Roman', Username: 'Paľa', DateOfBirth: 0, Rank: 171 },
    { Name: 'Štefan', Username: 'Veselovský st.', DateOfBirth: 0, Rank: 172 },
    { Name: 'Daniel', Username: 'Kubica', DateOfBirth: 0, Rank: 173 },
    { Name: 'Libor', Username: 'Zurvalec', DateOfBirth: 0, Rank: 174 },
    { Name: 'Michal', Username: 'Samardák', DateOfBirth: 0, Rank: 175 },
    { Name: 'Ľubomír', Username: 'Kán', DateOfBirth: 0, Rank: 176 },
    { Name: 'Stanislav', Username: 'Harmata', DateOfBirth: 0, Rank: 177 },
    { Name: 'Jozef', Username: 'Gužik', DateOfBirth: 0, Rank: 178 },
    { Name: 'Dušan', Username: 'Kováč st.', DateOfBirth: 0, Rank: 179 },
    { Name: 'Karol', Username: 'Kormaňák', DateOfBirth: 0, Rank: 180 },
    { Name: 'Dávid', Username: 'Zboroň', DateOfBirth: 0, Rank: 181 },
    { Name: 'Peter', Username: 'Káčer', DateOfBirth: 0, Rank: 182 },
    { Name: 'Albert', Username: 'Paríšek', DateOfBirth: 0, Rank: 183 },
    { Name: 'Dušan', Username: 'Hančiak', DateOfBirth: 0, Rank: 184 },
    { Name: 'Timotej', Username: 'Šprlák', DateOfBirth: 0, Rank: 185 },
    { Name: 'Ľudovít', Username: 'Cyrul', DateOfBirth: 0, Rank: 186 },
    { Name: 'Anton', Username: 'Kuhejda', DateOfBirth: 0, Rank: 187 },
    { Name: 'Maroš', Username: 'Kuboš', DateOfBirth: 0, Rank: 188 },
    { Name: 'Jozef', Username: 'Frčo', DateOfBirth: 0, Rank: 189 },
    { Name: 'Jozef', Username: 'Zmoray', DateOfBirth: 0, Rank: 190 },
    { Name: 'Štefan', Username: 'Veselovský ml.', DateOfBirth: 0, Rank: 191 },
    { Name: 'Jozef', Username: 'Chudják', DateOfBirth: 0, Rank: 192 },
    { Name: 'Jozef', Username: 'Bombjak', DateOfBirth: 0, Rank: 193 },
    { Name: 'Erik', Username: 'Zurvalec', DateOfBirth: 0, Rank: 194 },
    { Name: 'Miroslav', Username: 'Chovančák', DateOfBirth: 0, Rank: 195 },
    { Name: 'Michal', Username: 'Štefák', DateOfBirth: 0, Rank: 196 },
    { Name: 'Jozef', Username: 'Hutira', DateOfBirth: 0, Rank: 197 },
    { Name: 'Jozef', Username: 'Strežo', DateOfBirth: 0, Rank: 198 },
    { Name: 'Pavol', Username: 'Šustek', DateOfBirth: 0, Rank: 199 },
    { Name: 'Jozef', Username: 'Blaško', DateOfBirth: 0, Rank: 200 },
    { Name: 'Leopold', Username: 'Kovalík', DateOfBirth: 2001, Rank: 201 },
    { Name: 'Štefan', Username: 'Duraj', DateOfBirth: 0, Rank: 202 },
    { Name: 'Ján', Username: 'Teťák', DateOfBirth: 0, Rank: 203 },
    { Name: 'Anton', Username: 'Tekeľ', DateOfBirth: 0, Rank: 204 },
    { Name: 'Ján', Username: 'Kovalčík', DateOfBirth: 0, Rank: 205 },
    { Name: 'Stanislav', Username: 'Veselovský', DateOfBirth: 0, Rank: 206 },
    { Name: 'Štefan', Username: 'Očkaják', DateOfBirth: 0, Rank: 207 },
    { Name: 'Jozef', Username: 'Jurčiga', DateOfBirth: 0, Rank: 208 },
    { Name: 'Ladislav', Username: 'Hulín', DateOfBirth: 0, Rank: 209 },
    { Name: 'Ján', Username: 'Harezník', DateOfBirth: 0, Rank: 210 },
    { Name: 'Peter', Username: 'Sitárik', DateOfBirth: 0, Rank: 211 },
    { Name: 'Štefan', Username: 'Jašica st.', DateOfBirth: 0, Rank: 212 },
    { Name: 'Emil', Username: 'Jašica', DateOfBirth: 0, Rank: 213 },
    { Name: 'Richard', Username: 'Lupták', DateOfBirth: 0, Rank: 214 },
    { Name: 'Roman', Username: 'Hricko', DateOfBirth: 0, Rank: 215 },
    { Name: 'Vladimír', Username: 'Barabáš', DateOfBirth: 0, Rank: 216 },
    { Name: 'Martin', Username: 'Ferneza', DateOfBirth: 0, Rank: 217 },
    { Name: 'Ivan', Username: 'Melník', DateOfBirth: 0, Rank: 218 },
    { Name: 'Ján', Username: 'Kubačka st.', DateOfBirth: 0, Rank: 219 },
    { Name: 'František', Username: 'Piták', DateOfBirth: 0, Rank: 220 },
    { Name: 'Stanislav', Username: 'Cyrul', DateOfBirth: 0, Rank: 221 },
    { Name: 'František', Username: 'Jašica', DateOfBirth: 0, Rank: 222 },
    { Name: 'Pavol', Username: 'Grobarčík st.', DateOfBirth: 0, Rank: 223 },
    { Name: 'Ján', Username: 'Flak', DateOfBirth: 0, Rank: 224 },
    { Name: 'Ľubomír', Username: 'Mazurák', DateOfBirth: 0, Rank: 225 },
    { Name: 'Tadeáš', Username: 'Šustek', DateOfBirth: 0, Rank: 226 },
    { Name: 'Marko', Username: 'Hajdúch', DateOfBirth: 0, Rank: 227 },
    { Name: 'Michal', Username: 'Vrbinčík', DateOfBirth: 0, Rank: 228 },
    { Name: 'Václav', Username: 'Baraniak', DateOfBirth: 0, Rank: 229 },
    { Name: 'Emil', Username: 'Rončák', DateOfBirth: 0, Rank: 230 },
    { Name: 'Miroslav', Username: 'Bugaj', DateOfBirth: 0, Rank: 231 },
    { Name: 'Patrik', Username: 'Sojčák', DateOfBirth: 0, Rank: 232 },
    { Name: 'Ivan', Username: 'Franko', DateOfBirth: 0, Rank: 233 },
    { Name: 'Milan', Username: 'Hajdúch', DateOfBirth: 0, Rank: 234 },
    { Name: 'Dušan', Username: 'Kurčina', DateOfBirth: 0, Rank: 235 },
    { Name: 'Ján', Username: 'Tomáň', DateOfBirth: 0, Rank: 236 },
    { Name: 'Ivan', Username: 'Bulvas st.', DateOfBirth: 0, Rank: 237 },
    { Name: 'Vladimír', Username: 'Toifl', DateOfBirth: 0, Rank: 238 },
    { Name: 'Ľubo', Username: 'Rošťák', DateOfBirth: 0, Rank: 239 },
    { Name: 'Peter', Username: 'Žofaj', DateOfBirth: 0, Rank: 240 },
    { Name: 'Stanislav', Username: 'Drbiak', DateOfBirth: 0, Rank: 241 },
    { Name: 'Adam', Username: 'Novák', DateOfBirth: 0, Rank: 242 },
    { Name: 'Vladimír', Username: 'Zmoray', DateOfBirth: 0, Rank: 243 },
    { Name: 'Václav', Username: 'Pillár', DateOfBirth: 0, Rank: 244 },
    { Name: 'Anton', Username: 'Čipčala st.', DateOfBirth: 0, Rank: 245 },
    { Name: 'Adrián', Username: 'Škrabek', DateOfBirth: 0, Rank: 246 },
    { Name: 'Tomáš', Username: 'Romaňák', DateOfBirth: 0, Rank: 247 },
    { Name: 'Jozef', Username: 'Suľa', DateOfBirth: 0, Rank: 248 },
    { Name: 'Vladimír', Username: 'Dibdiak', DateOfBirth: 0, Rank: 249 },
    { Name: 'František', Username: 'Plavák', DateOfBirth: 0, Rank: 250 },
    { Name: 'Dušan', Username: 'Polťák', DateOfBirth: 0, Rank: 251 },
    { Name: 'Jozef', Username: 'Garabáš', DateOfBirth: 0, Rank: 252 },
    { Name: 'Ondrej', Username: 'Mikuška', DateOfBirth: 0, Rank: 253 },
    { Name: 'Pavel', Username: 'Šeliga', DateOfBirth: 0, Rank: 254 },
    { Name: 'Marián', Username: 'Hutlas ', DateOfBirth: 0, Rank: 255 },
    { Name: 'Adam', Username: 'Daňa', DateOfBirth: 0, Rank: 256 },
    { Name: 'Ľubomír', Username: 'Záň', DateOfBirth: 0, Rank: 257 },
    { Name: 'Kristián', Username: 'Kurčinka', DateOfBirth: 0, Rank: 258 },
    { Name: 'Martin', Username: 'Žatkuliak', DateOfBirth: 0, Rank: 259 },
    { Name: 'Peter', Username: 'Eckert', DateOfBirth: 0, Rank: 260 },
    { Name: 'Tadeáš', Username: 'Dulka', DateOfBirth: 0, Rank: 261 },
    { Name: 'František', Username: 'Briš', DateOfBirth: 0, Rank: 262 },
    { Name: 'Michal', Username: 'Harezník', DateOfBirth: 0, Rank: 263 },
    { Name: 'Patrik', Username: 'Šeliga', DateOfBirth: 0, Rank: 264 },
    { Name: 'Juraj', Username: 'Šeliga', DateOfBirth: 0, Rank: 265 },
    { Name: 'Andrej', Username: 'Žabka', DateOfBirth: 0, Rank: 266 },
    { Name: 'Peter', Username: 'Oščadnický', DateOfBirth: 0, Rank: 267 },
    { Name: 'Martin', Username: 'Vengrín', DateOfBirth: 0, Rank: 268 },
    { Name: 'Benedikt', Username: 'Hajdúch', DateOfBirth: 0, Rank: 269 },
    { Name: 'Robert', Username: 'Judiak', DateOfBirth: 0, Rank: 270 },
    { Name: 'Tomáš', Username: 'Konštiak', DateOfBirth: 0, Rank: 271 },
    { Name: 'Tomáš', Username: 'Jadroň', DateOfBirth: 0, Rank: 272 },
    { Name: 'Tibor', Username: 'Červeň', DateOfBirth: 0, Rank: 273 },
    { Name: 'Andrej', Username: 'Žáčik', DateOfBirth: 0, Rank: 274 },
    { Name: 'Alex', Username: 'Vnučák', DateOfBirth: 0, Rank: 275 },
    { Name: 'Jaroslav', Username: 'Kutlík', DateOfBirth: 0, Rank: 276 },
    { Name: 'Miroslav', Username: 'Hajdučík', DateOfBirth: 0, Rank: 277 },
    { Name: 'Ľubomír', Username: 'Čič', DateOfBirth: 0, Rank: 278 },
    { Name: 'Marek', Username: 'Grobarčík', DateOfBirth: 0, Rank: 279 },
    { Name: 'Lukáš', Username: 'Bujnák', DateOfBirth: 0, Rank: 280 },
    { Name: 'Jozef', Username: 'Žabka', DateOfBirth: 0, Rank: 281 },
    { Name: 'Dušan', Username: 'Kolenčík ml.', DateOfBirth: 0, Rank: 282 },
    { Name: 'Matúš', Username: 'Lipničan', DateOfBirth: 0, Rank: 283 },
    { Name: 'Tomáš', Username: 'Hurák', DateOfBirth: 0, Rank: 284 },
  ])

  useEffect(() => {
    createTable()
  }, [])

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'Users ' +
          '(ID INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, Password TEXT, TrainerUsr TEXT, TrainerPasswd TEXT, tournamentID INTEGER); '
      )
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'Players ' +
          '(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Username TEXT, DateOfBirth INTEGER, Rank INTEGER); '
      )
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          'Matches ' +
          '(ID INTEGER PRIMARY KEY AUTOINCREMENT, TournamentName TEXT, PlayerOneID INTEGER, PlayerTwoID INTEGER, WinnerID INTEGER, Table INTEGER); '
      )
    })
  }

  // const addPlayers = () => {
  //   db.transaction((tx) => {
  //     for(var i = 0; i < players.length; i++){
  //       tx.executeSql('INSERT INTO Players (Name, Username, DateOfBirth, Rank) VALUES (?, ?, ?, ?)', 
  //         [players[i].Name, players[i].Username, players[i].DateOfBirth, players[i].Rank]
  //     )
  //     }
  //   })
  // }

  const generateString = (length) => {
    var result = ''
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    } else {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT Username FROM Users WHERE Username = ?',
            [email.value],
            (tx, results) => {
              var len = results.rows.length
              console.log('item:', results.rows.length)
              if (len > 0) {
                Alert.alert(
                  'Použivateľ existuje!',
                  'Použite iný email alebo obnovte heslo.'
                )
              } else {
                var trainerUsr = 'trainer'
                var trainerPasswd = generateString(7)
                console.log(trainerPasswd)
                console.log(trainerUsr)
                tx.executeSql(
                  'INSERT INTO Users (Username, Password, TrainerUsr, TrainerPasswd) VALUES (?, ?, ?, ?)',
                  [email.value, password.value, trainerUsr, trainerPasswd]
                )
                Alert.alert(
                  'Úspešné',
                  'Zapíš si trenerové údaje! Meno: ' +
                    trainerUsr +
                    ', Heslo: ' +
                    trainerPasswd
                )
              }
            }
          )
        })

        //  db.transaction( (tx) => {
        //    tx.executeSql(
        //     "INSERT INTO Users (Username, Password) VALUES (?, ?)",
        //     ['erikzurvalec86@gmail.com', 'admin']
        //   );
        // });

        // db.transaction((tx) => {
        //   tx.executeSql(
        //     "SELECT * FROM Users", [],
        //     (tx, results) => {
        //       var len = results.rows.length;
        //       console.log('item:', results.rows.length);
        //       console.log(results.rows.item(0).Username);
        //       console.log(results.rows.item(0).Password)
        //       // if (len > 0) {
        //       //   var userName = results.rows.item(0).Username;
        //       //   var pass = results.rows.item(0).Password;
        //       //   setEmailDB(userName);
        //       //   setPasswordDB(pass);
        //       //   console.log(emailDB);
        //       // }
        //     }
        //   );
        // });
        // db.transaction((tx) => {
        //   tx.executeSql(
        //     "DELETE FROM Users", [], () => {console.log('success')}, error => {console.log(error)}
        //   )
        // })

        navigation.replace('Login')
      } catch (error) {
        console.log(error)
      }
    }

    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: "Dashboard" }],
    // });
  }
  return (
    <View style={styles.body}>
      <BackButton
        goBack={() => {
          navigation.replace('Home')
        }}
      />
      <Text style={styles.text}>Výtvorenie účtu</Text>
      <Text>Zadaj meno</Text>
      <TextInput
        style={styles.input}
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      <Text>Zadaj email</Text>
      <TextInput
        style={styles.input}
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <Text>Zadaj heslo</Text>
      <TextInput
        style={styles.input}
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <CustomButton
        title="Potvrdiť"
        color="#1eb900"
        style={{ width: '30%', marginTop: 24 }}
        onPressFunction={onSignUpPressed}
      />

      <View style={styles.row}>
        <Text>Máš už vytvorený účet? </Text>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text>Login</Text>
        </TouchableOpacity>
      </View>

      {/* <CustomButton
        title="Add players"
        color="#1eb900"
        style={{ width: '30%', marginTop: 24 }}
        onPressFunction={addPlayers}
      /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    margin: 5,
    backgroundColor: '#FFFFFF',
  },
  text: {
    color: '#000000',
    textAlign: 'center',
    fontSize: 30,
  },
  input: {
    borderWidth: 1,
    width: 300,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 20,
    margin: 5,
  },
})
