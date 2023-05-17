
fools_one_a={
  \set Staff.connectArpeggios = ##t
  \time 12/8
  \partial 2.
  <<
    \set Staff.connectArpeggios = ##t
    \key a \major
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      e8 fis g a b d' |
      
      \repeat unfold 4 {e'8\RH #1 e'16\RH #2 e'\RH #1 e'8\RH #3 } |
      \repeat unfold 3 {
        \repeat unfold 4 {e'8 e'16 e' e'8} |
      }
      \bar "||" \break
      
      \repeat unfold 4 {
        \repeat unfold 4 {e'8 e'16 e' e'8} |
      }
      \bar "||" \break
      
      \repeat unfold 4 {
        \repeat unfold 4 {e'8 e'16 e' e'8} |
      }
      \bar "||" \break
      
      R1.*4 |
      \bar "||" \break
      
      \repeat unfold 4 {
        \repeat unfold 4 {e'8 e'16 e' e'8} |
      }
      \bar "||" \break
      
      \repeat unfold 4 {
        \repeat unfold 4 {e'8 e'16 e' e'8} |
      }
      \bar "||" \break
    }
  >>
  
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \repeat unfold 2{
        <a d' a' d'' fis'' a''>8_"pizz."^"V-D maj."\staccato r4 r4. r4. r4. |
        <b e' b' e'' gis'' b''>8_"pizz."^"VII-E maj."\staccato r4 r4. r4. r4. |
      }
      \bar "||" \break
      
      \repeat unfold 2 {
        e'8 e'16 e' e'8 b8 b16 b b8 d'8 d'16 d' d'8 fis'8 fis'16 fis' fis'8 |
        \repeat unfold 2 {d'8 d'16 d' d'8}
        \repeat unfold 2 {e'8 e'16 e' e'8}
      }
      \bar "||" \break
      
      R1.*4 |
      \bar "||" \break
      
      \repeat unfold 4 {
        \repeat unfold 4 {e'8 e'16 e' e'8} |
      }
      \bar "||" \break
      
      R1.*4 |
      \bar "||" \break
      
      \repeat unfold 2 {
        \repeat unfold 2 {
          \tuplet 3/2 {a''16( b'' a''} e''8) e'' 
        }
        \repeat unfold 2 {
          \tuplet 3/2 {b''16( cis''' b''} e''8) e''
        } |
      }
      \tuplet 3/2 {d'''16( e''' d'''} e''8) e''
      \tuplet 3/2 {cis'''16( d''' cis'''} e''8) e''
      \tuplet 3/2 {b''16( cis''' b''} e''8) e''
      \tuplet 3/2 {a''16( b'' a''} e''8) e'' | \noBreak 
      gis'8 b' d'' e'' gis'' b'' e'''4\staccato r2 |
      \bar "|." \break
    }
  >>
}
  

fools_two_a={
  \set Staff.connectArpeggios = ##t
  \key a \major
  \time 12/8
  \partial 2.
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      r4. r8 e32 b e' gis' r8 |
      
      R1.*2 |
      b'8_"pizz." a' gis' a' gis' d' e' gis' a' gis' e' d' |
      b'8 a' gis' a' gis' d' e' gis' a' gis' b' cis'' |
      \bar "||" \break
      
      \repeat unfold 2 {
        b'8_"pizz." a' gis' a' gis' d' e' gis' a' gis' e' d' |
        b'8 a' gis' a' gis' d' e' gis' a' gis' b' cis'' |
      }
      \bar "||" \break
      
      b'8_"pizz." a' gis' a' gis' d' e' gis' a' gis' e' d' |
      b'8 a' gis' a' gis' d' e' gis' a' gis' b' cis'' |
      b'8_"pizz." a' gis' a' gis' d' e' gis' a' gis' e' d' |
      b'8 a' gis' a' gis' d' e' r4 e'8 r4 |
      \bar "||" \break
      
      \repeat unfold 2{
        <a d' a' d'' fis'' a''>8_"pizz."^"V-D maj."\staccato r4 r4. r4. r4. |
        <b e' b' e'' gis'' b''>8^"VII-E maj."\staccato r4 r4. r4. r4. |
      }
      \bar "||" \break
    }
    
  >>
  <<
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      gis''8._"nat." a''16 b''8 r4. cis'''8. b''16 a''8 r4. |
      d'''8. cis'''16 b''8 cis''' b'' a'' b''2. |
      gis''8. a''16 b''8 r4. cis'''8. b''16 a''8 r4. |
      d'''8. cis'''16 b''8 cis''' b'' a'' b''2. |
      \bar "||" \break
      
      gis''8. a''16 b''8 r4. cis'''8. b''16 a''8 r4. |
      d'''8. cis'''16 b''8 cis''' b'' a'' b''2. |
      gis''8. a''16 b''8 r4. cis'''8. b''16 a''8 r4. |
      d'''8. cis'''16 b''8 cis''' b'' a'' b''4. b''16( a'') gis''( e'') fis''( gis'') |
      \bar "||" \break
    }
  >>
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \repeat unfold 2 {
        \repeat unfold 12 fis''8
        \repeat unfold 12 gis''8
      }
      \bar "||" \break
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      \repeat unfold 4 {
        \repeat unfold 8 b'8. 
      }
      \bar "||" \break
    }
  >>
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      R1.*3 | r2. cis'''8 b'' a'' gis'' fis'' e'' |
      \bar "||"
      
      R1.*4 |
      \bar "||" \break
      
      \repeat unfold 2 {
        b'8_"pizz." a' gis' a' gis' d' e' gis' a' gis' e' d' |
        b'8 a' gis' a' gis' d' e' gis' a' gis' b' cis'' |
      }
      \bar "||" \break
      
      \repeat unfold 2 {
        b'8_"pizz." a' gis' a' gis' d' e' gis' a' gis' e' d' |
        b'8 a' gis' a' gis' d' e' gis' a' gis' b' cis'' |
      }
      \bar "||" \break
      
      b'8_"nat." a' gis' a' gis' d' e' gis' a' gis' e' d' |
      b'8 a' gis' a' gis' d' e' gis' a' gis' b' cis'' |
      b'8 a' gis' a' gis' d' e' gis' a' gis' e' d' | \noBreak 
      r4. r8 e32 b e' gis' r8 <b gis' e''>4\staccato r2 |
      \bar "|." \break
      
      \solopage
    }
  >>
}
  
fools_three_a={
  \set Staff.connectArpeggios = ##t
  \key a \major
  \time 12/8
  \partial 2.
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      r4. r8 r8 e'32 a' d'' a'' |
      
      R1.*4 |
      \bar "||" \break
      
      \repeat unfold 2 {
        d''8. cis''16( b'8) cis'' b' a' b' gis'16( a') b'8 gis'16( a') b'( cis'' b'8) |
        d''8. cis''16( b'8) cis'' b' a' b'8 b'16 b' b'8 b'8 b'16 b' b'8 |
      }
      \bar "||" \break
      
      \repeat unfold 2 {
        d''8. cis''16( b'8) cis'' b' a' b' gis'16( a') b'8 gis'16( a') b'( cis'' b'8) |
        d''8. cis''16( b'8) cis'' b' a' b'8 b'16 b' b'8 b'8 b'16 b' b'8 |
      }
      \bar "||" \break
      
      b'4. cis'' a' b' | d'' e'' b' fis'' |
      b'4. cis'' a' b' | d'' e'' b' gis'' |
      \bar "||" \break
      
      r4. b'8 cis'' d'' r4. cis''8 d'' gis'' |
      gis''8. fis''16 e''8 fis'' gis'' fis'' gis''2. |
      r4. b'8 cis'' d'' r4. cis''8 d'' gis'' |
      gis''8. fis''16 e''8 fis'' gis'' fis'' e''2. |
      \bar "||" \break
      
      r4. b'8 cis'' d'' r4. cis''8 d'' gis'' |
      gis''8. fis''16 e''8 fis'' gis'' fis'' gis''2. |
      r4. b'8 cis'' d'' r4. cis''8 d'' gis'' |
      gis''8. fis''16 e''8 fis'' gis'' fis'' e''2. |
      \bar "||" \break
    }
  >>
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      b'4. cis'' a' b' | d'' e'' b' fis'' |
      b'4. cis'' a' b' | d'' e'' b' gis'' |
      \bar "||" \break
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      b4. cis' b d' cis' e' d' cis' |
      b4. cis' b d' cis' e' d'8 e' fis' d' fis' a' |
      \bar "||" \break
    }
  >>
  
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      r4. \tuplet 3/2 {gis'16( a' gis'} d'8) d' r4. \tuplet 3/2 {e'16( fis' e'} a8) a |
      b8 cis' d' \tuplet 3/2 {fis'16( gis' fis'} d'8) cis' e'2. |
      r4. \tuplet 3/2 {gis'16( a' gis'} d'8) d' r4. \tuplet 3/2 {e'16( fis' e'} a8) a |
      b8 cis' d' \tuplet 3/2 {fis'16( gis' fis'} d'8) cis' e'2. |
      \bar "||" \break
            
      d''1. | b'1. | a'1. | <gis' b'>1. |
      \bar "||"
      
      R1.*4 |
      \bar "||" \break
      
      \solopage
      
      \repeat unfold 3 {
        d''8. cis''16( b'8) cis'' b' a' b' gis'16( a') b'8 gis'16( a') b'( cis'' b'8) |
      }
      d''8. cis''16( b'8) cis'' b' a' b' gis'16( a') b'8 gis'16( a') b'( cis'') d''8 |
      \bar "||" \break
      
      \repeat unfold 3 {
        d''8. cis''16( b'8) cis'' b' a' b' gis'16( a') b'8 gis'16( a') b'( cis'' b'8) |
      } \noBreak 
      r4. r8 r8 e'32 a' d'' a'' b''4\staccato r2 |
      \bar "|." \break
    }
  >>
}
fools_four_a={
  \set Staff.connectArpeggios = ##t
  \key a \major
  \time 12/8
  \partial 2.
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      r4. r4. |

      <b e' b' e'' gis'' b''>8 r4 r4. r4. r4. |
      R1.*3 |
      \bar "||"
      
      R1.*4 |
      \bar "||"
      
      fis''8. e''16 d''8 e'' cis'' d''  e'' cis''16( d'') e''8 cis''16( d'') e''( fis'' e''8) |
      fis''8. e''16 d''8 e'' cis'' d''  e'' gis''16 gis'' gis''8 gis''8 gis''16 gis'' gis''8 |
      fis''8. e''16 d''8 e'' cis'' d''  e'' cis''16( d'') e''8 cis''16( d'') e''( fis'' e''8) |
      fis''8. e''16 d''8 e'' cis'' d''  e'' gis''16( a'') b''8 b''8 b''16 cis''' d'''8 |
      |
    }
  >>
  
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
        \repeat unfold 6 {d'8\RH #2 d'\RH #3 } |
        \repeat unfold 12 e'8 |
        \repeat unfold 12 d'8 |
        \repeat unfold 12 e'8 |
      \bar "||" \break
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
        \repeat unfold 8 e8.\RH #1 |
        \repeat unfold 8 e8. |
        \repeat unfold 8 e8. |
        \repeat unfold 8 e8. |
    }
  >>
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      R1.*4 |
      \bar "||" 
      
      R1.*4 |
      \bar "||"
    }
  >>
  
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \repeat unfold 2 {
        \repeat unfold 12 d'8 |
        \repeat unfold 12 e'8 |
      }
      \bar "||" \break
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \repeat unfold 2 {
        \repeat unfold 8 e8. |
        \repeat unfold 8 e8. |
      }
    }
  >>
  <<
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \tuplet 3/2 {b''16( cis''' b''} e''8) e'' r4. \tuplet 3/2 {a''16( b'' a''} e''8) e'' r4. |
      d''8 e'' fis'' \tuplet 3/2 {a''16( b'' a''} e''8) fis'' gis''2. | 
      \tuplet 3/2 {b''16( cis''' b''} e''8) e'' r4. \tuplet 3/2 {a''16( b'' a''} e''8) e'' r4. |
      d''8 e'' fis'' \tuplet 3/2 {a''16( b'' a''} e''8) fis'' gis''2. | 
      \bar "||" \break
      
      
      
      \repeat unfold 2 {
        d'8 e d' e d' e d' e d' e d' e | e'8 e e' e e' e e' e e' e e' e |
      }      
      \bar "||" \break
      
      R1.*2
      fis''8. e''16 d''8 e'' cis'' d''  e'' cis''16( d'') e''8 cis''16( d'') e''( fis'' e''8) |
      fis''8. e''16 d''8 e'' cis'' d''  e'' cis''16( d'') e''8 cis''16( d'') e''( fis'') gis''8 |
      \bar "||" \break
    }
  >>
  
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \repeat unfold 12 d'8 |
      \repeat unfold 12 e'8 |
      \repeat unfold 12 d'8 |
      \repeat unfold 12 e'8 |
      \bar "||" \break
      
      \repeat unfold 6 {d'8 \RH #2 gis' \RH #3 } |
      \repeat unfold 6 {e'8 gis'} |
      \repeat unfold 6 {d'8 gis'} |
      \noBreak 
      e8 fis g a b d'
      e'4\staccato s2 |
      \bar "|." \break
      
      \solopage
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \repeat unfold 8 e8. |
      \repeat unfold 8 e8. |
      \repeat unfold 8 e8. |
      \repeat unfold 8 e8. |
      \bar "||" \break
      
      \repeat unfold 4 {e8. \RH #1 b \RH #1 } |
      \repeat unfold 4 {e8. b} |
      \repeat unfold 4 {e8. b} |
      s1. |
      \bar "|." \break
    }
  >>
}