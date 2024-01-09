
fools_one_a={
  \set Staff.connectArpeggios = ##t
  \time 12/8
  \key a \major
  \tempo 4.=80
  \partial 2.
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \mark \markup { \circle "A" }
      
      g8_\< fis e8 fis b d'_\! |
      
      
      <>_\f
      
      \repeat unfold 4 {e'8\RH #1 e'16\RH #2 e'\RH #1 e'8\RH #3 } |
      {e'8_\> e'16 e' e'8} {e'8 e'16 e' e'8} {e'8 e'16 e' e'8} {e'8 e'16 e' e'8_\!} |
      
      <>_\mp
      
      \repeat unfold 2 {
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
      \bar "||"
      
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
      
      <>\mf
      
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
      
      <>\f
      
      b'4. cis'' a' b' | d'' e'' b' fis'' |
      b'4. cis'' a' b' | d'' e'' b' gis'' |
      \bar "||"
      
      <>\mp
      
      \repeat unfold 4 {
        \repeat unfold 4 {e'8 e'16 e' e'8} |
      }
      \bar "||" \break
      
      <>_\mf
      \repeat unfold 2 {
        \repeat unfold 4 {e'8 e'16 e' e'8} |
      }
      
      {e'8 16 16 8} {fis'8 16 16 8} {gis'8 16 16 8} {a'8 16 16 8} |
      {b'8 16 16 8} {cis''8 16 16 8} {d''8 16 16 8} {gis''8 16 16 8} |
      
      \bar "||"
      
      <>\f
      
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
      gis'8 b' d''8 e'' gis'' b'' e'''8->_\ff e'''16 e''' e'''8 e'''8-> e'''16 e''' e'''8 |
      \bar "||"
    }
  >>
}
  

fools_two_a={
  \set Staff.connectArpeggios = ##t
  \tempo 4.=80
  \key a \major
  \time 12/8
  \partial 2.
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \mark \markup { \circle "A" }
      
      r4. r8 \tuplet 3/2 {e16_\f e' gis'} r8 |
      
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
      
      <>\mf
      
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
      
      <>\f
            
      d''1. | b'1. | a'1. | <gis' b'>1. |
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
      
      <>\f
      
      b'8_"nat." a' gis' a' gis' d' e' gis' a' gis' e' d' |
      b'8 a' gis' a' gis' d' e' gis' a' gis' b' cis'' |
      b'8 a' gis' a' gis' d' e' gis' a' gis' e' d' | \noBreak 
      r4. r8 \tuplet 3/2 {e16 e' gis'} r8 <b gis' e''>8->_\ff[ e''16 e'' e''8] e''->[ e''16 e'' e''8] |
      \bar "||"
    }
  >>
}
  
fools_three_a={
  \set Staff.connectArpeggios = ##t
  \tempo 4.=80
  \key a \major
  \time 12/8
  \partial 2.
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \mark \markup { \circle "A" }
      
      r4. r8 r8 \tuplet 3/2 {a'16_\f d'' a''} |
      
      R1.*4 |
      \bar "||"
      
      <>\mp
      
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
      
      <>\mf
      
      b'4. cis'' a' b' | d'' e'' b' fis'' |
      b'4. cis'' a' b' | d'' e'' b' gis'' |
      \bar "||" \break
      
      <>\mp
      
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
      
      <>\mf
      
      b'4.-"div." cis'' a' b' | d'' e'' b' fis'' |
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
      
      r4. \tuplet 3/2 {<gis'\4>16( a' gis'} <d'>8) d' r4. \tuplet 3/2 {<e'\5>16( fis' e'} <a>8) a |
      b8 cis' d' \tuplet 3/2 {fis'16( gis' fis'} d'8) <cis'-1> <e'-4\5>2. |
      r4. \tuplet 3/2 {gis'16( a' gis'} d'8) d' r4. \tuplet 3/2 {e'16( fis' e'} a8) a |
      b8 cis' d' \tuplet 3/2 {fis'16( gis' fis'} d'8) cis' e'2. |
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
      
      R1.*4 |
      \bar "||"
      
      \solopage
      
      <>\mf
      \repeat unfold 3 {
        d''8. cis''16( b'8) cis'' b' a' b' gis'16( a') b'8 gis'16( a') b'( cis'' b'8) |
      }
      d''8. cis''16( b'8) cis'' b' a' b' gis'16( a') b'8 gis'16( a') b'( cis'') d''8 |
      \bar "||" \break
      
      <>\f
      
      \repeat unfold 3 {
        d''8. cis''16( b'8) cis'' b' a' b' gis'16( a') b'8 gis'16( a') b'( cis'' b'8) |
      } \noBreak 
      r4. r8 r8 \tuplet 3/2 {a'16 d'' a''} b''8->_\ff b''16 b'' b''8 b''8-> b''16 b'' b''8 |
      \bar "||"
    }
  >>
}
fools_four_a={
  \set Staff.connectArpeggios = ##t
  \tempo 4.=80
  \key a \major
  \time 12/8
  \partial 2.
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \mark \markup { \circle "A" }
      
      r4. r4. |

      <b e' b' e'' gis'' b''>8_"VII-E maj."\staccato_\f r4 r4. r4. r4. |
      R1.*3 |
      \bar "||"
      
      R1.*4 |
      \bar "||" \break
      
      <>\mp
      
      fis''8. e''16 d''8 e'' cis'' d''  e'' cis''16( d'') e''8 cis''16( d'') e''( fis'' e''8) |
      fis''8. e''16 d''8 e'' cis'' d''  e'' gis''16 gis'' gis''8 gis''8 gis''16 gis'' gis''8 |
      fis''8. e''16 d''8 e'' cis'' d''  e'' cis''16( d'') e''8 cis''16( d'') e''( fis'' e''8) |
      fis''8. e''16 d''8 e'' cis'' d''  e'' gis''16( a'') b''8 b''8 b''16 cis''' d'''8 |
      \bar "||" \break
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
      
      <>\mf
      
      b'4. cis'' a' b' | d'' e'' b' fis'' |
      b'4. cis'' a' b' | d'' e'' b' gis'' |
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
      <d''-3\3>8 <e''-1\2> fis'' \tuplet 3/2 {a''16( b'' a''} <e''-0>8) fis'' gis''2. | 
      \tuplet 3/2 {b''16( cis''' b''} e''8) e'' r4. \tuplet 3/2 {a''16( b'' a''} e''8) e'' r4. |
      d''8 e'' fis'' \tuplet 3/2 {a''16( b'' a''} e''8) fis'' gis''2. | 
      \bar "||" \break
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
      
      R1.*2
      
      <>\mf
      
      fis''8. e''16 d''8 e'' cis'' d''  e'' cis''16( d'') e''8 cis''16( d'') e''( fis'' e''8) |
      fis''8. e''16 d''8 e'' cis'' d''  e'' cis''16( d'') e''8 cis''16( d'') e''( fis'') gis''8 |
      \bar "||" \break
    }
  >>
  
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      <>\mf
      
      \repeat unfold 12 d'8 |
      \repeat unfold 12 e'8 |
      \repeat unfold 12 d'8 |
      \repeat unfold 12 e'8 |
      \bar "||" \break
      
      <>\f
      
      \repeat unfold 6 {d'8 \RH #2 gis' \RH #3 } |
      \repeat unfold 6 {e'8 gis'} |
      \repeat unfold 6 {d'8 gis'} |
      \noBreak 
      g8 fis e8 fis b d'
      <b e' b' e'' gis'' b''>8->_\ff^"VII-E maj." <b e' b' e'' gis'' b''>16 <b e' b' e'' gis'' b''>16 <b e' b' e'' gis'' b''>8
      <b e' b' e'' gis'' b''>8-> <b e' b' e'' gis'' b''>16 <b e' b' e'' gis'' b''>16 <b e' b' e'' gis'' b''>8 |
      \break
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
      \bar "||"
    }
  >>
}