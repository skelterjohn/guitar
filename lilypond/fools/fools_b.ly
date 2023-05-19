
fools_one_b={
  \set Staff.connectArpeggios = ##t
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \noBreak
      R1. |
      \bar "||"
      
      \mark \markup { \circle "B" }
      
    }
  >>
}
  
fools_two_b={
  \set Staff.connectArpeggios = ##t
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \noBreak
      R1. |
      \bar "||"
      
      \mark \markup { \circle "B" }
      
      R1. * 4 |
      R1. * 4 |
      R1. * 4 |
      
      R1. * 2 |
      b'4. cis'' b'8 cis'' d'' e'' fis'' a'' |
      gis''1.
      \bar "||" \break
      
    }
  >>
}
  
fools_three_b={
  \set Staff.connectArpeggios = ##t
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \noBreak
      R1. |
      \bar "||"
      
      \mark \markup { \circle "B" }
      \repeat unfold 2 {
        \repeat unfold 2 {a''8 d'' a'' d'' a'' d''} |
        \repeat unfold 2 {a''8 cis'' a'' cis'' a'' cis''} |
      }
      \bar "||" \break
      
      e''8 cis'' e'' cis'' e'' cis''
      fis''8 cis'' fis'' cis'' fis'' cis'' |
      gis''8 cis'' gis'' cis'' gis'' cis''
      a''8 cis'' a'' cis'' a'' cis'' |
      \repeat unfold 4 {
        a''8 cis'' a'' cis'' a'' cis''
      }
      \bar "||" \break
      
      \repeat unfold 4 {
        fis''8 d'' fis'' d'' fis'' d''
      }
      \repeat unfold 4 {
        gis''8 d'' gis'' d'' gis'' d''
      }
      \bar "||" \break
      
      \repeat unfold 3 {
        a''8 d'' a'' d'' a'' d'' e''8 cis'' e'' cis'' e'' cis''
      }
      
      \repeat unfold 2 {
        gis''8 d'' gis'' d'' gis'' d''
      }
      \bar "||" \break
    }
  >>
}

fools_four_b={
  \set Staff.connectArpeggios = ##t
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \noBreak
      \repeat unfold 4 e4. |
      \bar "||"
      
      \mark \markup { \circle "B" }
      \repeat unfold 2 {
        \repeat unfold 8 {e8. e8.} |
      }
      \bar "||" \break
      
      \repeat unfold 8 {a8. a8.} |
      \repeat unfold 8 {g8. e8.} |
      \bar "||" \break
      
      \repeat unfold 4 b8.
      \repeat unfold 4 cis'8.
      \repeat unfold 4 d'8.
      \repeat unfold 4 d'8.
      \repeat unfold 8 {e'8. e'} |
      \bar "||" \break
      
      \repeat unfold 3 {
        \repeat unfold 4 d'8.
        \repeat unfold 4 a8.
      }
      \repeat unfold 4 {e8. b8.}
      \bar "||" \break
    }
  >>
}