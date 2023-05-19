
fools_one_b={
  \set Staff.connectArpeggios = ##t
  \tempo 4=80
  \numericTimeSignature \time 4/4
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \noBreak
      R1 |
      \bar "||"
      
      \mark \markup { \circle "B" }
      
      R1*4 |
      \bar "||"
      
      R1*4 |
      \bar "||"
      
      R1*4 |
      \bar "||"
      
      R1*4 |
      \bar "||"
      
      d''4~ \tuplet 3/2 {d''8 cis'' d''} \tuplet 3/2 {e'' d''~d''} \tuplet 3/2 {cis''8 d'' e''} |
      d''4~ \tuplet 3/2 {d''8 cis'' d''} \tuplet 3/2 {e'' d''~d''} \tuplet 3/2 {cis''8 d'' e''} |
      d''4~ \tuplet 3/2 {d''8 cis'' d''}
        \tuplet 3/2 {e'' d'' cis''}
          \tuplet 3/2 {d'' cis'' b'} |
            \tuplet 3/2 {cis'' b' a'}
              \tuplet 3/2 {b' a' gis'}
                \tuplet 3/2 {a' gis' fis'}
                \tuplet 3/2 {gis' fis' e'} |
      
    }
  >>
}
  
fools_two_b={
  \set Staff.connectArpeggios = ##t
  \tempo 4=80
  \numericTimeSignature \time 4/4
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \noBreak
      R1 |
      \bar "||"
      
      \mark \markup { \circle "B" }
      
      R1 * 4 |
      R1 * 4 |
      R1 * 4 |
      
      R1 * 1 |
      b'4 cis'' \tuplet 3/2 {b'8 cis'' d''} \tuplet 3/2{e'' fis'' a''} |
      gis''1 | r2 fis''4 gis'' |
      \bar "||" \break
      
      a''4~ \tuplet 3/2 {a''8 gis'' a''} b''4 \tuplet 3/2 {a''8~a'' gis''8} |
      a''4~ \tuplet 3/2 {a''8 gis'' a''} b''4 \tuplet 3/2 {a''8~a'' gis''8} |
      a''4~ \tuplet 3/2 {a''8 gis'' a''} b''4 \tuplet 3/2 {fis''8~fis'' a''8} |
      gis''1 |
      \bar "||" \break
    }
  >>
}
  
fools_three_b={
  \set Staff.connectArpeggios = ##t
  \tempo 4=80
  \numericTimeSignature \time 4/4
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \noBreak
      R1 |
      \bar "||"
      
      \mark \markup { \circle "B" }
      \repeat unfold 2 {
        \repeat unfold 2 {\tuplet 3/2 {a''8 d'' a''} \tuplet 3/2 {d'' a'' d''}} |
        \repeat unfold 2 {\tuplet 3/2 {a''8 cis'' a''} \tuplet 3/2 {cis'' a'' cis''}} |
      }
      \bar "||" \break
      
      \repeat unfold 2 {
      
        \repeat unfold 2 {
          \tuplet 3/2 {e''8 cis'' e''} \tuplet 3/2 {cis'' e'' cis''}
          \tuplet 3/2 {fis''8 cis'' fis''} \tuplet 3/2 {cis'' fis'' cis''} |
          \tuplet 3/2 {gis''8 cis'' gis''} \tuplet 3/2 {cis'' gis'' cis''}
          \tuplet 3/2 {a''8 cis'' a''} \tuplet 3/2 {cis'' a'' cis''} |
          \repeat unfold 4 {
            \tuplet 3/2 {a''8 cis'' a''} \tuplet 3/2 {cis'' a'' cis''}
          }
          \bar "||" \break
        }
        
        \repeat unfold 4 {
          \tuplet 3/2 {fis''8 d'' fis''} \tuplet 3/2 {d'' fis'' d''}
        }
        \repeat unfold 4 {
          \tuplet 3/2 {gis''8 d'' gis''} \tuplet 3/2 {d'' gis'' d''}
        }
        \bar "||" \break
        
        \repeat unfold 3 {
          \tuplet 3/2 {a''8 d'' a''} \tuplet 3/2 {d'' a'' d''}
          \tuplet 3/2 {e''8 cis'' e''} \tuplet 3/2 {cis'' e'' cis''}
        }
        
        \repeat unfold 2 {
          \tuplet 3/2 {gis''8 d'' gis''} \tuplet 3/2 {d'' gis'' d''}
        }
        \bar "||" \break
      }
    }
  >>
}

fools_four_b={
  \set Staff.connectArpeggios = ##t
  \tempo 4=80
  \numericTimeSignature \time 4/4
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \noBreak
      \repeat unfold 4 e4 |
      \bar "||"
      
      \mark \markup { \circle "B" }
      \repeat unfold 2 {
        \repeat unfold 8 {e8 e8} |
      }
      \bar "||" \break
      
      \repeat unfold 2 {
        \repeat unfold 2 {
          \repeat unfold 8 {a8 a8} |
          \repeat unfold 8 {g8 e8} |
          \bar "||" \break
        }
        
        \repeat unfold 4 b8
        \repeat unfold 4 cis'8
        \repeat unfold 4 d'8
        \repeat unfold 4 d'8
        \repeat unfold 8 {e'8 e'} |
        \bar "||" \break
        
        \repeat unfold 3 {
          \repeat unfold 4 d'8
          \repeat unfold 4 a8
        }
        \repeat unfold 4 {e8 b8}
        \bar "||" \break
      }
    }
  >>
}