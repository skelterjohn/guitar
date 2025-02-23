
fools_one_c={
  \set Staff.connectArpeggios = ##t
  \time 12/8
  \key a \major
  \tempo 4.=80
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \mark \markup { \circle "C" }
      
      \repeat unfold 3 {
        \repeat unfold 4 {e'8 e'16 e' e'8}
      }
      \repeat unfold 2 {e'8 e'16 e' e'8}
      e'8->\staccato r4 e'8->\staccato r4 |
      \bar "||" \break
      
      b'4._\f cis'' a' b' | d'' e'' b' fis'' |
      b'4. cis'' a' b' | d'' e'' b' gis'' |
      \bar "||" \break
      
      R1.*2 |
      fis''8. e''16 d''8 e'' cis'' d''  e'' cis''16( d'') e''8 cis''16( d'') e''( fis'' e''8) |
      fis''8. e''16 d''8 e'' cis'' d''  e'' gis''16( a'') b''8 b''8 b''16( cis''') d'''8 |
      \bar "||" \break

      <>_\f
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
      gis'8 b' d''8 e'' gis'' b'' e'''8->\staccato\ff r4 r4.  |
      \bar "||"
    }
  >>
}

fools_two_c={
  \set Staff.connectArpeggios = ##t
  \time 12/8
  \key a \major
  \tempo 4.=80
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \mark \markup { \circle "C" }
      
      b'8^"pizz." a' gis' a' gis' d' e' gis' a' gis' e' d' |
      b'8 a' gis' a' gis' d' e' gis' a' gis' b' cis'' |
      b'8^"pizz." a' gis' a' gis' d' e' gis' a' gis' e' d' |
      b'8 a' gis' a' gis' d' e'8->\staccato r4 e'8->\staccato r4 |
      \bar "||" \break

      <>_\mf
      \repeat unfold 2{
        <a d' a' d'' fis'' a''>8^"pizz."_"V-D maj."\staccato r4 r4. r4. r4. |
        <b e' b' e'' gis'' b''>8_"VII-E maj."\staccato r4 r4. r4. r4. |
      }
      \bar "||" \break
      
      \repeat unfold 2 {
        b'8^"pizz." a' gis' a' gis' d' e' gis' a' gis' e' d' |
        b'8 a' gis' a' gis' d' e' gis' a' gis' b' cis'' |
      }
      \bar "||" \break
      
      <>_\f
      b'8^"nat." a' gis' a' gis' d' e' gis' a' gis' e' d' |
      b'8 a' gis' a' gis' d' e' gis' a' gis' b' cis'' |
      b'8 a' gis' a' gis' d' e' gis' a' gis' e' d' | \noBreak 
      r4. r8 \tuplet 3/2 {e16 e' gis'} r8 <b gis' e''>8->\staccato\ff r4 r4. |
      \bar "||"
    }
  >>
}

fools_three_c={
  \set Staff.connectArpeggios = ##t
  \time 12/8
  \key a \major
  \tempo 4.=80
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \mark \markup { \circle "C" }
      
      R1.*4 | \bar "||"
    }
  >>
  
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      <>_\mf
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
      
      \repeat unfold 3 {
        d''8. cis''16( b'8) cis'' b' a' b' gis'16( a') b'8 gis'16( a') b'( cis'' b'8) |
      }
      d''8. cis''16( b'8) cis'' b' a' b' gis'16( a') b'8 gis'16( a') b'( cis'') d''8 |
      \bar "||" \break
      
      <>_\f
      \repeat unfold 3 {
        d''8. cis''16( b'8) cis'' b' a' b' gis'16( a') b'8 gis'16( a') b'( cis'' b'8) |
      } \noBreak 
      r4. r8 r8 \tuplet 3/2 {a'16 d'' a''} b''8->\staccato\ff r4 r4. |
      \bar "||"
    }
  >>
}

fools_four_c={
  \set Staff.connectArpeggios = ##t
  \time 12/8
  \key a \major
  \tempo 4.=80
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \mark \markup { \circle "C" }
      
      R1.*4 | \bar "||"
    }
  >>
  
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      <>_\mf
      
      \repeat unfold 12 d'8 |
      \repeat unfold 12 e'8 |
      \repeat unfold 12 d'8 |
      \repeat unfold 12 e'8 |
      \bar "||" \break
      
      \repeat unfold 12 d'8 |
      \repeat unfold 12 e'8 |
      \repeat unfold 12 d'8 |
      \repeat unfold 12 e'8 |
      \bar "||" \break
      
      <>_\f
      \repeat unfold 6 {d'8 \RH #2 gis' \RH #3 } |
      \repeat unfold 6 {e'8 gis'} |
      \repeat unfold 6 {d'8 gis'} |
      \noBreak 
      g8 fis e8 fis b d'
      <b e' b' e'' gis'' b''>8->\staccato^"VII-E maj."\ff r4
      r4. |
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
