
fools_one_b={
  \set Staff.connectArpeggios = ##t
  \tempo \markup {
    \concat {
      (
      \smaller \general-align #Y #DOWN \note {4.} #1
      " = "
      \smaller \general-align #Y #DOWN \note {4} #1
      )
    }
  }
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
      
      d''2 \tuplet 3/2 {e''8 d''~d''} \tuplet 3/2 {cis''8 d'' e''} |
      d''2 \tuplet 3/2 {e''8 d''~d''} \tuplet 3/2 {cis''8 d'' e''} |
      d''2
        \tuplet 3/2 {e''8 d'' cis''}
          \tuplet 3/2 {d'' cis'' b'} |
            \tuplet 3/2 {cis'' b' a'}
              \tuplet 3/2 {b' a' gis'}
                \tuplet 3/2 {a' gis' fis'}
                  \tuplet 3/2 {gis' fis' e'} |
      \bar "||"
      
      R1 |
      \tuplet 12/8 {e'8 cis'16([ d')] e'8 cis'16([ d') e'(fis')] e'8~} e'2 |
      R1
      r2. \tuplet 3/2 {gis'8 a' b'} |
      \bar "||" \break
      
      \tuplet 12/8 {e''8 cis''16([ d'')] e''8 cis''16([ d'') e''(fis'')] e''8~} e''2 |
      R1 |
      \tuplet 12/8 {g'8 e'16([ fis')] g'8 e'16([ fis') g'(a')] g'8~} g'2 |
      R1 |
      \bar "||" \break
      \solopage
      
      R1*4 |
      \bar "||"
      
      d''2 \tuplet 3/2 {e''8 d''~d''} \tuplet 3/2 {cis''8 d'' e''} |
      d''2 \tuplet 3/2 {e''8 d''~d''} \tuplet 3/2 {cis''8 d'' e''} |
      d''2
        \tuplet 3/2 {e''8 d'' cis''}
          \tuplet 3/2 {d'' cis'' b'} |
            \tuplet 3/2 {cis'' b' a'}
              \tuplet 3/2 {b' a' gis'}
                \tuplet 3/2 {a' gis' fis'}
                  \tuplet 3/2 {gis' fis' e'} |
      \bar "||" \break
      
      \repeat unfold 4 {
        \repeat unfold 4 {
          \tuplet 6/4 {e'8 e'16 e' e'8}
        }
      }
      \bar "||" \break
    }
  >>
}
  
fools_two_b={
  \set Staff.connectArpeggios = ##t
  \tempo \markup {
    \concat {
      (
      \smaller \general-align #Y #DOWN \note {4.} #1
      " = "
      \smaller \general-align #Y #DOWN \note {4} #1
      )
    }
  }
  \numericTimeSignature \time 4/4
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \noBreak
      R1 |
      \bar "||"
      
      \mark \markup { \circle "B" }
      
      R1 * 4 | \bar "||"
      R1 * 4 | \bar "||"
      R1 * 4 | \bar "||"
      
      R1 * 1 |
      b'4 cis'' \tuplet 3/2 {b'8 cis'' d''} \tuplet 3/2{e'' fis'' a''} |
      gis''1 | r2 fis''4 gis'' |
      \bar "||" \break
      
      a''4~ \tuplet 3/2 {a''8 gis'' a''} b''4 \tuplet 3/2 {a''8~a'' gis''8} |
      a''4~ \tuplet 3/2 {a''8 gis'' a''} b''4 \tuplet 3/2 {a''8~a'' gis''8} |
      a''4~ \tuplet 3/2 {a''8 gis'' a''} b''4 \tuplet 3/2 {fis''8~fis'' a''8} |
      gis''1 |
      \bar "||" \break
      
      \tuplet 6/4 {cis''4 b' a' gis' fis' e'} |
      r2 \tuplet 3/2 {cis''4 b' a'} |
      \tuplet 3/2 {g'4 fis' e'~} e'2 |
      R1 |
      \bar "||" \break
      
      R1 |
      \tuplet 6/4 {a'4 b' cis'' e'' fis'' a'' } |
      b''1 |
      R1 |
      \bar "||" \break
      
      R1 * 1 |
      b'4 cis'' \tuplet 3/2 {b'8 cis'' d''} \tuplet 3/2{e'' fis'' a''} |
      gis''1 | r2 fis''4 gis'' |
      \bar "||" \break
      
      a''4~ \tuplet 3/2 {a''8 gis'' a''} b''4 \tuplet 3/2 {a''8~a'' gis''8} |
      a''4~ \tuplet 3/2 {a''8 gis'' a''} b''4 \tuplet 3/2 {a''8~a'' gis''8} |
      a''4~ \tuplet 3/2 {a''8 gis'' a''} b''4 \tuplet 3/2 {fis''8~fis'' a''8} |
      gis''1 |
      \bar "||" \break
      
      R1 |
      r2 \tuplet 3/2 {a'4 b' cis''} |
      d''4 cis'' b' a' gis' fis' e' gis' |
      \bar "||" \break
    }
  >>
}
  
fools_three_b={
  \set Staff.connectArpeggios = ##t
  \tempo \markup {
    \concat {
      (
      \smaller \general-align #Y #DOWN \note {4.} #1
      " = "
      \smaller \general-align #Y #DOWN \note {4} #1
      )
    }
  }
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

      \tuplet 3/2 {e''8\>_"down to zero" cis'' e''} \tuplet 3/2 {cis'' e'' cis''}
      \tuplet 3/2 {fis''8 cis'' fis''} \tuplet 3/2 {cis'' fis'' cis''} |
      \tuplet 3/2 {e''8 cis'' e''} \tuplet 3/2 {cis'' e'' cis''}
      \tuplet 3/2 {fis''8 cis'' fis''} \tuplet 3/2 {cis'' fis'' cis''} |
      \tuplet 3/2 {e''8 cis'' e''} \tuplet 3/2 {cis'' e'' cis''}
      \tuplet 3/2 {fis''8 cis'' fis''} \tuplet 3/2 {cis'' fis'' cis''} |
      \tuplet 3/2 {e''8 cis'' e''} \tuplet 3/2 {cis'' e'' cis''}
      \tuplet 3/2 {fis''8 cis'' fis''} \tuplet 3/2 {cis'' fis'' cis''\!} |
      \bar "||" \break
    }
        
  >>
}

fools_four_b={
  \set Staff.connectArpeggios = ##t
  \tempo \markup {
    \concat {
      (
      \smaller \general-align #Y #DOWN \note {4.} #1
      " = "
      \smaller \general-align #Y #DOWN \note {4} #1
      )
    }
  }
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
      
      a8\>_"down to zero"
      \repeat unfold 7 a8 |
      \repeat unfold 8 a8 |
      \repeat unfold 8 a8 |
      \repeat unfold 7 a8
      a8\! |
      \solopage
    }
  >>
}