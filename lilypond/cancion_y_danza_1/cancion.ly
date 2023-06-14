cancion_one={
  \tempo 4=40
  \time 6/8
  \key d \minor
  \partial 4
  
  d''8_\mp e'' |
  \bar ".|:"
  
  \repeat volta 2 {
    f''4 e''8~ e'' g'' f'' |
    d''2. |
    
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        a2. | a2. |
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        <f>4 <f>8 <e>4. |
        e2. |   
      }
      \new Voice { \voiceThree
        s2. | r4. r8 b''_\< c'''_\! |            
      }
    >>
    \noPageBreak
    
    \allbreak
    
    d'''8._\mf e'''16 d'''8~ d''' c'''_\> a''_\! |
    bes''8_\mp a'' bes''~ bes''4. |
    r4. <e''>8 <g''> <f''> |
    \alternative {
      \volta 1 {
        d''4.~ d''8 d'' e'' |
      }
      \volta 2 {
        d''4.~ d''8 a''_\< d'''_\! |
      }
    }
  }
   
  c'''8_\f a''4 bes''8 c''' e''' |
  <<
    \new Voice {
      d'''4. cis'''4. |
    }
    \new Voice {
      
    }
  >>
  r4. <d'>4 d'''16^"rit."_\< e'''_\! |
  <d a d' f'' a'' d'''>2\arpeggio_\ff d''8_\mp e'' |
  f''4 e''8 d''8. e''16^"rit." d'' c'' |
  c''4.-> r4. |
  r4. <e'>4 c'8 |
  <d' fis' d'' a''>2\arpeggio\fermata d''8 e'' |\noPageBreak \noBreak
  
  f''4 e''8~ e'' g'' f'' |
  d''2. |
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      a2. |
      <a>2. |
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      <f>4 <f>8 <e>4. |
      r4. r8 b''_\< c'''_\! |
    }
  >>
  d'''8._\mf e'''16 d'''8~ d''' c'''_\> a''_\! |
  bes''8_\mp a'' bes''~ bes''4. |
  r4. <e''>8^"rit." <g''> <f''> |
  d''2.\fermata |
  \solopage
}

cancion_two={
  \tempo 4=40
  \time 6/8
  \key d \minor
  \partial 4
 
  r4_\mp |
  \bar ".|:"
  
  \repeat volta 2 {
    a'4 a'8 <b'>4 cis''8 |
    <a'>4 <d' a'>8\staccato_\> <d' a'>4._\! |
    <c'' f''>4 <c''>8 <d''>4. |
    <c'' e''>4 <c'' e''>8\staccato_\> <c'' e''>4._\! |
    <d a  e''>4->_\mf <d a  e''>8 <fis''>4. |
    <e''>4_\mp <e''>8 <f''>4. |
    <<
      \new Voice { \voiceOne
        <bes'>4. <a'>8 <b' > <cis'' > |
      }
      \new Voice { \voiceTwo
        g4. a4. |
      }
    >>
    \alternative {
      \volta 1 {
        <<
          \new Voice{ \voiceOne
            <a'>4 <d' a'>8\staccato_\> <d' a'>4._\! |
          }
          \new Voice{\voiceTwo
            d2.
          }
        >>
      }
      \volta 2 {
        <<
          \new Voice{ \voiceOne
            <a'>4 <d' a'>8\staccato_\> <d' a'>8_\! r4 |
          }
          \new Voice{\voiceTwo
            d2.
          }
        >>
      }
    }
  }
  e''4_\f e''8 f''4 g''8 |
  a''2. |
  <f''>4. e''4 c'16^"rit."_\< bes_\! |
  <d a d' f'' a'' d'''>2\arpeggio_\ff r4_\mp |
  <d''>4 c''16 a' g'8 <a'>4 |
  f'4.-> c''8 d'' a' |
  c''8 b'4~ <b'>4 r8 |
  <d' fis' d'' a''>2.\arpeggio\fermata |
  
  a'4 a'8 <b'>4 cis''8 |
  <a'>4 <d' a'>8\staccato_\> <d' a'>4._\! |
  <c'' f''>4 <c''>8 <d''>4. |
  <c'' e''>4 <c'' e''>8\staccato_\> <c'' e''>4._\! |
  <d a a' d'' e'' e''>4\arpeggio_\mf <d a a' d'' e'' e''>8-> <fis''>4._\mp |
  <e''>4 <e''>8 <f''>4. |
  <<
    \new Voice { \voiceOne
      <bes'>4. <a'>8 <b' > <cis'' > |
      <a'>4\fermata <d' a'>8\staccato_\> <d' a'>4.\fermata_\! |
    }
    \new Voice { \voiceTwo
      g4. a4. |
      d2. |
    }
  >>
  \solopage
}

cancion_three={
  \tempo 4=40
  \time 6/8
  \key d \minor
  \partial 4
  
  r4_\mp |
  \bar ".|:"
  
  \repeat volta 2 {
    r4. <g'>4 a'8 |
    f'4 f'8\staccato_\> f'4._\! |
    a'4 a'8 g'4. |
    a'2. |
    <d a  e''>4->_\mf <d a  e''>8 <g' b'>4. |
    <g'>4_\mp <g'>8 <d''>4. |
    <<
      \new Voice { \voiceOne
        <e'>4 f'8 g'4 e'8 |
      }
      \new Voice { \voiceTwo
        g4. a4. |
      }
    >>
    \alternative {
      \volta 1 {
        <<
          \new Voice { \voiceOne
            <f'>4 <f'>8\staccato_\> <f'>4._\! |
          }
          \new Voice { \voiceTwo
            d2. |
          }
        >>
      }
      \volta 2 {
        <<
          \new Voice { \voiceOne
            <f'>4 <f'>8\staccato_\> <f'>8_\! r4 |
          }
          \new Voice { \voiceTwo
            d2. |
          }
        >>
      }
    }
  }
  a'4_\f a'8 d''4 d''8 |
  e''2. |
  <f' c'' >4. c'4 c'16^"rit."_\< bes_\! |
  <d a d' f'' a'' d'''>2\arpeggio_\ff r4_\mp |
  <g'>2 <e'>4 |
  <c'>4.-> r4. |
  r4. <g'~>4 g'16 g' |
  <d' fis' d'' a''>2.\arpeggio\fermata |
  
  r4. <g'>4 a'8 |
  f'4 f'8\staccato_\> f'4._\! |
  a'4 a'8 g'4. |
  <e a'>2. |
  <d a a' d'' e'' e''>4\arpeggio_\mf <d a a' d'' e'' e''>8-> <g' b'>4._\mp |
  <g'>4 <g'>8 <d''>4. |
    <<
      \new Voice { \voiceOne
        <e'>4 f'8 g'4 e'8 |
        <f'>4\fermata <f'>8\staccato_\> <f'>4.\fermata_\! |
      }
      \new Voice { \voiceTwo
        g4. a4. |
        d2. |
      }
    >>
  \solopage
}

cancion_four={
  \tempo 4=40
  \time 6/8
  \key d \minor
  \partial 4
  
  r4_\mp |
  \bar ".|:"
  
  \repeat volta 2 {
    d4. a |
    <<
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        d2. |
      }
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        r4. r8 f'' g'' |
      }
    >>
    a''8. bes''16 a''8~ a'' c''' b'' |
    a''4.~a''8 b''_\< c'''_\! |
    d'''8._\mf e'''16 d'''8~ d'''4. |
    <<
      \new Voice {\voiceTwo
        c'4_\mp c'8 d'4. |
      }
      \new Voice {\voiceOne
        r4. r8 c'''8 bes'' |
      }
    
    >>
    a''8. g''16 f''8 <e''> <g''> <f''> |
    \alternative {
      \volta 1 {
        d''2. |
      }
      \volta 2 {
        d''4.~ d''8 r4 |
      }
    }
  }
  a4._\f a |
  <<
    \new Voice { \voiceTwo
      a2. |
    }
    \new Voice { \voiceOne
      r4. r8 a'' d''' |
    }
    
  >>
  c'''4 bes''8 a''16 bes'' c'''8 d'''16^"rit."_\< e'''_\!|
  <d a d' f'' a'' d'''>2\arpeggio_\ff r4_\mp |
  c'8 <a e'>4 bes4.|
  <f>4.-> c'''8 d''' a'' |
  c'''8 b''4~ b'' g''8 |
  <d' fis' d'' a''>2.\arpeggio\fermata |
  
  d4. a4. |
  <<
    \new Voice {\voiceTwo
      d2. |
    }
    \new Voice {\voiceOne
      r4. r8 f'' g'' |
    }
  >>
  a''4 \grace{bes''16( a'' g''} a''8)~ a'' c''' b'' |

  a''4.~ a''8 b''_\< c'''_\! |
  d'''8._\mf e'''16 d'''8~ d'''4. |
  <<
    \new Voice{\voiceTwo
      c'4 c'8 d'4. |
    }
    \new Voice{\voiceOne
      r4. r8 c''' bes'' |
    }
  >>
  a''8. g''16 f''8 <e''>^"rit." <g''> <f''> |
  d''2.\fermata |
  \solopage
}
