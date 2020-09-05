\version "2.18.2"
\header {
  title = "jazz chords"
}

#(define custom-fretboard-table-one (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-one
  \chordmode{g:maj7}
  #guitar-tuning
  #'(
      (barre 1 6 3)
      (place-fret 6 3 1)
      (place-fret 5 5 3)
      (place-fret 4 5 4)
      (place-fret 3 4 2)
      (place-fret 2 3 1)
      (place-fret 1 3 1))
\storePredefinedDiagram #custom-fretboard-table-one
  \chordmode{g:m}
  #guitar-tuning
  #'(
      (barre 1 6 3)
      (place-fret 6 3 1)
      (place-fret 5 5 3)
      (place-fret 4 5 4)
      (place-fret 3 3 1)
      (place-fret 2 3 1)
      (place-fret 1 3 1))
\storePredefinedDiagram #custom-fretboard-table-one
  \chordmode{g:7}
  #guitar-tuning
  #'(
      (barre 1 6 3)
      (place-fret 6 3 1)
      (place-fret 5 5 3)
      (place-fret 4 3 1)
      (place-fret 3 4 2)
      (place-fret 2 3 1)
      (place-fret 1 3 1))
\storePredefinedDiagram #custom-fretboard-table-one
  \chordmode{g:m7}
  #guitar-tuning
  #'(
      (barre 1 6 3)
      (place-fret 6 3 1)
      (place-fret 5 5 3)
      (place-fret 4 3 1)
      (place-fret 3 3 1)
      (place-fret 2 3 1)
      (place-fret 1 3 1))
rowOne = {
  \chordmode {
    \set predefinedDiagramTable = #custom-fretboard-table-one
    \set minorChordModifier = \markup { \super "-" }
    g1:maj7 g:m g:7 g:m7
  }
}

#(define custom-fretboard-table-two (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-two
  \chordmode{g:maj7}
  #guitar-tuning
  #'(
      (place-fret 6 3 1)
      (mute 5)
      (place-fret 4 4 3)
      (place-fret 3 4 4)
      (place-fret 2 3 2)
      (mute 1))
\storePredefinedDiagram #custom-fretboard-table-two
  \chordmode{g:7}
  #guitar-tuning
  #'(
      (place-fret 6 3 1)
      (mute 5)
      (place-fret 4 3 2)
      (place-fret 3 4 4)
      (place-fret 2 3 3)
      (mute 1))
\storePredefinedDiagram #custom-fretboard-table-two
  \chordmode{g:m7}
  #guitar-tuning
  #'(
      (barre 4 2 3)
      (place-fret 6 3 2)
      (mute 5)
      (place-fret 4 3 3)
      (place-fret 3 3 3)
      (place-fret 2 3 3)
      (mute 1))
\storePredefinedDiagram #custom-fretboard-table-two
  \chordmode{g:m}
  #guitar-tuning
  #'(
      (place-fret 6 3 2)
      (mute 5)
      (place-fret 4 3 3)
      (place-fret 3 3 4)
      (place-fret 2 2 1)
      (mute 1))
rowTwo = {
  \chordmode {
    \set predefinedDiagramTable = #custom-fretboard-table-two
    \set minorChordModifier = \markup { \super "-" }
    \set majorSevenSymbol = \markup { \whiteTriangleMarkup "7" }
    g1:maj7 g:7 g:m7
    \set minorChordModifier = \markup { \super "-7b5" }
    g:m
  }
}


#(define custom-fretboard-table-three-a (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-three-a
  \chordmode{g:m}
  #guitar-tuning
  #'(
      (barre 1 6 3)
      (place-fret 6 3 1)
      (place-fret 5 5 3)
      (place-fret 4 3 1)
      (place-fret 3 4 2)
      (place-fret 2 3 1)
      (place-fret 1 5 4))
\storePredefinedDiagram #custom-fretboard-table-three-a
  \chordmode{g:m7}
  #guitar-tuning
  #'(
      (barre 1 6 3)
      (place-fret 6 3 1)
      (place-fret 5 5 3)
      (place-fret 4 4 2)
      (place-fret 3 3 1)
      (place-fret 2 3 1)
      (place-fret 1 3 1))
#(define custom-fretboard-table-three-b (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-three-b
  \chordmode{g:m}
  #guitar-tuning
  #'(
      (place-fret 6 3 1)
      (mute 5)
      (place-fret 4 3 2)
      (place-fret 3 4 3)
      (place-fret 2 5 4)
      (mute 1))
#(define custom-fretboard-table-three-c (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-three-c
  \chordmode{g:m}
  #guitar-tuning
  #'(
      (barre 3 1 3)
      (place-fret 6 3 2)
      (mute 5)
      (place-fret 4 2 1)
      (place-fret 3 3 3)
      (place-fret 2 3 3)
      (place-fret 1 3 3))
rowThree = {
  \chordmode {
    \set predefinedDiagramTable = #custom-fretboard-table-three-a
    \set minorChordModifier = \markup { \super "9" }
    g1:m
    
    \set predefinedDiagramTable = #custom-fretboard-table-three-b
    \set minorChordModifier = \markup { \super "13" }
    g:m
    
    \set predefinedDiagramTable = #custom-fretboard-table-three-a
    \set minorChordModifier = \markup { \super { "-" \whiteTriangleMarkup } }
    g:m7
    
    \set predefinedDiagramTable = #custom-fretboard-table-three-c
    \set minorChordModifier = \markup { \super "-6" }
    g:m
  }
}

#(define custom-fretboard-table-four (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-four
  \chordmode{c:maj7}
  #guitar-tuning
  #'(
      (barre 1 6 3)
      (barre 4 2 5)
      (place-fret 6 3 1)
      (place-fret 5 3 1)
      (place-fret 4 5 3)
      (place-fret 3 5 3)
      (place-fret 2 5 3)
      (place-fret 1 3 1))
\storePredefinedDiagram #custom-fretboard-table-four
  \chordmode{c:m}
  #guitar-tuning
  #'(
      (barre 1 6 3)
      (place-fret 6 3 1)
      (place-fret 5 3 1)
      (place-fret 4 5 3)
      (place-fret 3 5 4)
      (place-fret 2 4 2)
      (place-fret 1 3 1))
\storePredefinedDiagram #custom-fretboard-table-four
  \chordmode{c:7}
  #guitar-tuning
  #'(
      (barre 1 6 3)
      (place-fret 6 3 1)
      (place-fret 5 3 1)
      (place-fret 4 5 3)
      (place-fret 3 3 1)
      (place-fret 2 5 4)
      (place-fret 1 3 1))
\storePredefinedDiagram #custom-fretboard-table-four
  \chordmode{c:m7}
  #guitar-tuning
  #'(
      (barre 1 6 3)
      (place-fret 6 3 1)
      (place-fret 5 3 1)
      (place-fret 4 5 3)
      (place-fret 3 3 1)
      (place-fret 2 4 2)
      (place-fret 1 3 1))
rowFour = {
  \chordmode {
    \set predefinedDiagramTable = #custom-fretboard-table-four
    \set minorChordModifier = \markup { \super "-" }
    c1:maj7 c:m c:7 c:m7
  }
}

#(define custom-fretboard-table-five-a (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-five-a
  \chordmode{c:maj7}
  #guitar-tuning
  #'(
      (barre 1 6 3)
      (place-fret 6 3 1)
      (place-fret 5 3 1)
      (place-fret 4 5 3)
      (place-fret 3 4 2)
      (place-fret 2 5 4)
      (place-fret 1 3 1))
#(define custom-fretboard-table-five-b (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-five-b
  \chordmode{c:m}
  #guitar-tuning
  #'(
      (barre 1 3 3)
      (mute 6)
      (place-fret 5 3 2)
      (place-fret 4 2 1)
      (place-fret 3 3 3)
      (place-fret 2 3 3)
      (place-fret 1 3 3))
#(define custom-fretboard-table-five-c (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-five-c
  \chordmode{c:m}
  #guitar-tuning
  #'(
      (barre 1 3 3)
      (mute 6)
      (place-fret 5 3 2)
      (place-fret 4 1 1)
      (place-fret 3 3 3)
      (place-fret 2 3 3)
      (place-fret 1 3 3))
\storePredefinedDiagram #custom-fretboard-table-five-c
  \chordmode{c:7}
  #guitar-tuning
  #'(
      (mute 6)
      (place-fret 5 3 3)
      (place-fret 4 2 2)
      (place-fret 3 3 4)
      (place-fret 2 1 1)
      (mute 1))
rowFive = {
  \chordmode {
    \set predefinedDiagramTable = #custom-fretboard-table-five-a
    \set majorSevenSymbol = \markup { \whiteTriangleMarkup "7" }
    \set minorChordModifier = \markup { \super "-" }
    c1:maj7
    \set predefinedDiagramTable = #custom-fretboard-table-five-b
    \set minorChordModifier = \markup { \super "9" }
    c1:m
    \set predefinedDiagramTable = #custom-fretboard-table-five-c
    \set minorChordModifier = \markup { \super "-9" }
    \set majorSevenSymbol = \markup { "7" }
    c1:m
    c:7
  }
}

#(define custom-fretboard-table-six-a (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-six-a
  \chordmode{c:maj7}
  #guitar-tuning
  #'(
      (barre 2 4 2)
      (mute 6)
      (place-fret 5 3 2)
      (place-fret 4 2 1)
      (place-fret 3 3 3)
      (place-fret 2 2 1)
      (mute 1))
\storePredefinedDiagram #custom-fretboard-table-six-a
  \chordmode{c:m}
  #guitar-tuning
  #'(
      (mute 6)
      (place-fret 5 3 2)
      (place-fret 4 2 1)
      (place-fret 3 3 3)
      (place-fret 2 4 4)
      (mute 1))
#(define custom-fretboard-table-six-b (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-six-b
  \chordmode{c:m}
  #guitar-tuning
  #'(
      (mute 6)
      (place-fret 5 3 2)
      (mute 4)
      (place-fret 3 3 3)
      (place-fret 2 4 4)
      (place-fret 1 2 1))
\storePredefinedDiagram #custom-fretboard-table-six-b
  \chordmode{c:m7}
  #guitar-tuning
  #'(
      (mute 6)
      (place-fret 5 3 1)
      (mute 4)
      (place-fret 3 3 2)
      (place-fret 2 4 4)
      (place-fret 1 3 3))
rowSix = {
  \chordmode {
    \set predefinedDiagramTable = #custom-fretboard-table-six-a
    \set majorSevenSymbol = \markup { "7b9" }
    \set minorChordModifier = \markup { \super "7#9" }
    c1:maj7 c:m
    \set predefinedDiagramTable = #custom-fretboard-table-six-b
    \set minorChordModifier = \markup { \super "-7b5" }
    \set majorSevenSymbol = \markup { "" }
    c:m
    \set minorChordModifier = \markup { \super "-" } 
    c:m7
  }
}


#(define custom-fretboard-table-seven-a (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-seven-a
  \chordmode{c:maj7}
  #guitar-tuning
  #'(
      (mute 6)
      (place-fret 5 3 1)
      (mute 4)
      (place-fret 3 4 3)
      (place-fret 2 5 4)
      (place-fret 1 3 2))
\storePredefinedDiagram #custom-fretboard-table-seven-a
  \chordmode{c:m}
  #guitar-tuning
  #'(
      (barre 6 1 3)
      (place-fret 6 3 1)
      (place-fret 5 3 1)
      (place-fret 4 5 4)
      (place-fret 3 4 2)
      (place-fret 2 4 3)
      (place-fret 1 3 1))
#(define custom-fretboard-table-seven-b (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-seven-b
  \chordmode{c:m}
  #guitar-tuning
  #'(
      (mute 6)
      (place-fret 5 3 2)
      (mute 4)
      (place-fret 3 2 1)
      (place-fret 2 4 4)
      (place-fret 1 3 3))
#(define custom-fretboard-table-seven-c (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-seven-c
  \chordmode{c:m}
  #guitar-tuning
  #'(
      (barre 1 4 5)
      (barre 6 1 3)
      (place-fret 6 3 1)
      (place-fret 5 3 1)
      (place-fret 4 5 3)
      (place-fret 3 5 3)
      (place-fret 2 5 3)
      (place-fret 1 5 3))
rowSeven= {
  \chordmode {
    \set predefinedDiagramTable = #custom-fretboard-table-seven-a
    \set minorChordModifier = \markup { \super { "-("\whiteTriangleMarkup "7)"} }
    \set majorSevenSymbol = \markup { \whiteTriangleMarkup "7" }
    c1:maj7 c:m
    \set predefinedDiagramTable = #custom-fretboard-table-seven-b
    \set minorChordModifier = \markup { \super { "-6"} }
    c:m
    \set predefinedDiagramTable = #custom-fretboard-table-seven-c
    \set minorChordModifier = \markup { \super { "6"} }
    c:m
  }
}
\markup {
  X means mute or don't play.
}
\markup{}
\markup {
  \whiteTriangleMarkup means major, - means minor.
}
\markup{}
\markup {
  These are movable chords with their roots on the 6th string. They are placed at
  third position, therefore G.
}
\score {
  <<
    \new ChordNames {
      \override ChordName #'font-size = #8
      \rowOne
    }
    \new FretBoards {
      \override FretBoard.size = 4
      \override FretBoard.fret-diagram-details.finger-code = #'in-dot
      \override FretBoard.fret-diagram-details.dot-color = #'white
      \override FretBoard.fret-diagram-details.barre-type = #'straight
      \override FretBoard.fret-diagram-details.number-type = #'roman-upper
      \override FretBoard.fret-diagram-details.top-fret-thickness = 7
      \override FretBoard.fret-diagram-details.fret-count = 5
      \rowOne
    }
    
    \new ChordNames {
      \override ChordName #'font-size = #8
      \rowTwo
    }
    \new FretBoards {
      \override FretBoard.size = 4
      \override FretBoard.fret-diagram-details.finger-code = #'in-dot
      \override FretBoard.fret-diagram-details.dot-color = #'white
      \override FretBoard.fret-diagram-details.barre-type = #'straight
      \override FretBoard.fret-diagram-details.number-type = #'roman-upper
      \override FretBoard.fret-diagram-details.top-fret-thickness = 7
      \override FretBoard.fret-diagram-details.fret-count = 5
      \rowTwo
    }
    \new ChordNames {
      \override ChordName #'font-size = #8
      \rowThree
    }
    \new FretBoards {
      \override FretBoard.size = 4
      \override FretBoard.fret-diagram-details.finger-code = #'in-dot
      \override FretBoard.fret-diagram-details.dot-color = #'white
      \override FretBoard.fret-diagram-details.barre-type = #'straight
      \override FretBoard.fret-diagram-details.number-type = #'roman-upper
      \override FretBoard.fret-diagram-details.top-fret-thickness = 7
      \override FretBoard.fret-diagram-details.fret-count = 5
      \rowThree
    }
  >>
}
\pageBreak
\markup {
  \line { X means mute or don't play. }
}
\markup{}
\markup {
  \whiteTriangleMarkup means major, - means minor.
}
\markup{}
\markup {
  These are movable chords with their roots on the 5th string. They are placed at
  third position, therefore C.
}
\score {
  <<
    \new ChordNames {
      \override ChordName #'font-size = #8
      \rowFour
    }
    \new FretBoards {
      \override FretBoard.size = 4
      \override FretBoard.fret-diagram-details.finger-code = #'in-dot
      \override FretBoard.fret-diagram-details.dot-color = #'white
      \override FretBoard.fret-diagram-details.barre-type = #'straight
      \override FretBoard.fret-diagram-details.number-type = #'roman-upper
      \override FretBoard.fret-diagram-details.top-fret-thickness = 7
      \override FretBoard.fret-diagram-details.fret-count = 5
      \rowFour
    }
    \new ChordNames {
      \override ChordName #'font-size = #8
      \rowFive
    }
    \new FretBoards {
      \override FretBoard.size = 4
      \override FretBoard.fret-diagram-details.finger-code = #'in-dot
      \override FretBoard.fret-diagram-details.dot-color = #'white
      \override FretBoard.fret-diagram-details.barre-type = #'straight
      \override FretBoard.fret-diagram-details.number-type = #'roman-upper
      \override FretBoard.fret-diagram-details.top-fret-thickness = 7
      \override FretBoard.fret-diagram-details.fret-count = 5
      \rowFive
    }
    \new ChordNames {
      \override ChordName #'font-size = #8
      \rowSix
    }
    \new FretBoards {
      \override FretBoard.size = 4
      \override FretBoard.fret-diagram-details.finger-code = #'in-dot
      \override FretBoard.fret-diagram-details.dot-color = #'white
      \override FretBoard.fret-diagram-details.barre-type = #'straight
      \override FretBoard.fret-diagram-details.number-type = #'roman-upper
      \override FretBoard.fret-diagram-details.top-fret-thickness = 7
      \override FretBoard.fret-diagram-details.fret-count = 5
      \rowSix
    }
    \new ChordNames {
      \override ChordName #'font-size = #8
      \rowSeven
    }
    \new FretBoards {
      \override FretBoard.size = 4
      \override FretBoard.fret-diagram-details.finger-code = #'in-dot
      \override FretBoard.fret-diagram-details.dot-color = #'white
      \override FretBoard.fret-diagram-details.barre-type = #'straight
      \override FretBoard.fret-diagram-details.number-type = #'roman-upper
      \override FretBoard.fret-diagram-details.top-fret-thickness = 7
      \override FretBoard.fret-diagram-details.fret-count = 5
      \rowSeven
    }
  >>
}
