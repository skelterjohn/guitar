% clockwork child, section A


tempo_a={\tempo 4 = 140}

child_a_one={
  \mark \markup \circle A
  \key a \major
  
  %1
  \fullcyclerest
  \combinedbreak \bar "||"
  
  %2
  \fullcyclerest
  \combinedbreak \bar "||"
  
  %3
  \fullcyclerest
  \combinedbreak \bar "||"
  
  %4
  \fullcyclerest
  \combinedbreak \bar "||"
  \solobreak
  
  %5
  r1 r1 |
  c'''4. b''8 ais''4 b'' | ais''1 |
  c'''4. b''8 ais''4 b'' | ais''2 gis'' |
  \combinedbreak
  c'''4. b''8 ais''4 b'' | ais''1 |
  c'''4. b''8 ais''4 b'' | ais''8 b'' ais'' b'' ais''8 b'' ais'' b'' |
  \combinedbreak \bar "||"
  \solobreak
  
  %6
  c'''4. b''8 ais''4 b'' | ais''2 gis'' |
  c'''4. b''8 ais''4 b'' | ais''1 |
  c'''4. b''8 ais''4 b'' | ais''2 gis'' |
  c'''4. b''8 ais''4 b'' | ais''1 |
  c'''4. b''8 ais''4 b'' | ais''8 b'' ais'' b'' ais''8 b'' ais'' b'' |
  \combinedbreak \bar "||"
  
  %tumble
  ais''8 b'' ais'' b'' ais''8 b'' ais'' b''|
  c'''4. b''8 ais''4 b'' |
  ais''8 b'' ais'' b'' ais''8 b'' ais'' b''|
  c'''4. b''8 ais''8 b'' r4 |
  R1*2
  \solobreak \combinedbreak \bar "||"
}

clockwork_a_one={
  \mark \markup \circle A
  \key f \minor
  
  %1
  \fullcyclerest
  \combinedbreak \bar "||"
  
  %2
  \fullcyclerest
  \combinedbreak \bar "||"
  
  %3
  \repeat percent 3 {
    bes'4 r8 bes'4 r8 bes'4 | r8 bes'4 r8 bes'4 r8 bes'8~ | bes'8 r8 bes'4 r8 bes'4 r8 |
  }
  bes'8\< bes' bes' bes' bes' bes' bes' bes'\! |
  \combinedbreak \bar "||"
  \solobreak
  
  %4 5 6
  \repeat unfold 3 {
    \repeat percent 5 {
      bes'8[ aes' g'] bes'[ aes' g'] bes'[ aes' |
      g'8] bes'[ aes' g'] bes'[ aes' g' aes'] |
    }
    \combinedbreak \bar "||"
    \solobreak
  }
  
  %tumble
  g'8 aes' g' aes' g' aes' g' aes' |
  bes'8[ aes' g'] bes'[ aes' g'] bes'[ aes'] |
  g'8 aes' g' aes' g' aes' g' aes' |
  bes'8[ aes' g'] bes' g' aes' r4 |
  R1*2
  \combinedbreak \bar "||"
  \solobreak
}

fire_a_one={
  \mark \markup \circle A
  \key ees \minor
  
  %1
  \fullcyclerest
  \combinedbreak \bar "||"
  \solobreak
  
  %2
  \repeat percent 10 {
    bes'8\staccato r4 bes'8\staccato r4 bes'8\staccato r |
  }
  \combinedbreak \bar "||"
  \solobreak
   
  %3
  \repeat percent 3 {
    \repeat unfold 3 {
      bes'8\staccato r4 bes'8\staccato r4 bes'8\staccato r |
    }
  }
  bes'8\staccato r4 bes'8\staccato r4 bes'8\staccato r |
  \combinedbreak \bar "||"
  \solobreak
  
  %4 5 6
  \repeat unfold 3 {
    \repeat unfold 2 {
     <bes' ees''>8\staccato r4 <bes' ees''>8\staccato r4 <bes' ees''>8\staccato r |
    }
    \repeat unfold 2 {
      <bes' ces''>8\staccato r4 <bes' ces''>8\staccato r4 <bes' ces''>8\staccato r |
    }
    \repeat unfold 2 {
      <bes' des''>8\staccato r4 <bes' des''>8\staccato r4 <bes' des''>8\staccato r |
    }
    \repeat unfold 2 {
      <bes' ces''>8\staccato r4 <bes' ces''>8\staccato r4 <bes' ces''>8\staccato r |
    }
    <bes' des''>8\staccato r4 <bes' des''>8\staccato r4 <bes' des''>8\staccato r |
    <bes' des''>8\staccato r4 <bes' des''>8\staccato r4 <bes' des'' e''>4-> |
    \bar "||"
    \combinedbreak
    \solobreak
  }
  \bar "||"
  
  %tumble
  ces''8 des'' ces'' des'' ces''8 des'' ces'' des'' | 
  <bes' ees''>8\staccato r4 <bes' ees''>8\staccato r4 <bes' ees''>8\staccato r |
  ces''8 des'' ces'' des'' ces''8 des'' ces'' des'' | 
  <bes' ees''>8\staccato r4 <bes' ees''>8\staccato ces''8 des'' r4 |
  R1*2
  \combinedbreak \bar "||"
  \solobreak
}

maker_a_one={
  \mark \markup \circle A
  \key cis \minor
          
  %1
  <e-0>8_\mf e e e e e e e |
  \repeat tremolo 8 {e8_"sim."} |
  \repeat tremolo 8 {<dis-0>8} | \repeat tremolo 8 {dis} |
  \repeat tremolo 8 {<e-0>8} | \repeat tremolo 8 {e} |
  \repeat tremolo 8 {<dis-0>}| \repeat tremolo 8 {dis} |
  \repeat tremolo 8 {<cis-0>8} | \repeat tremolo 8 {<dis-0>} |
  \combinedbreak \bar "||"
  \solobreak
  
  %2 %3 %4 %5
  \repeat unfold 4 {
    \repeat tremolo 8 {<e>8} |
    \repeat tremolo 8 {e8} |
    \repeat tremolo 8 {<dis>8} | \repeat tremolo 8 {dis} |
    \repeat tremolo 8 {<e>8} | \repeat tremolo 8 {e} |
    \repeat tremolo 8 {<dis>}| \repeat tremolo 8 {dis} |
    \repeat tremolo 8 {<cis>8} | \repeat tremolo 8 {<dis>} |
    \combinedbreak \bar "||"
  \solobreak
  }
  \solobreak
  
  %6
  \repeat tremolo 8 {<e>8} |
  \repeat tremolo 8 {e8} |
  \repeat tremolo 8 {<dis>8} | \repeat tremolo 8 {dis} |
  \repeat tremolo 8 {<e>8} | \repeat tremolo 8 {e} |
  \repeat tremolo 8 {<dis>}| \repeat tremolo 8 {dis} |
  \repeat tremolo 8 {<e>8} | \repeat tremolo 8 {<e>} |
  \combinedbreak \bar "||"
  \solobreak
  
  %tumble
  e4_\f\staccato e\staccato e\staccato e\staccato |
  e4\staccato e\staccato e\staccato e\staccato |
  e4\staccato e\staccato e\staccato e\staccato |
  e4\staccato e\staccato e\staccato e16_\markup {"pizz. B."}(f e8\staccato) |
  R1*2
  \combinedbreak \bar "||"
  \solobreak
}