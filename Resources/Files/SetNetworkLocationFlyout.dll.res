        ��  ��                  �  ,   U I F I L E   ��EH    0	          <duixml>

<element

resid="SNLPageFrame"

id="atom(SNLPageFrame)"

sheet="ModernStyle"

layout="flowlayout()"

padding="rect(40rp, 13rp, 40rp, 0rp)">

<element

layout="borderlayout()"

width="265rp"

padding="rect(0rp, 0rp, 0rp, 10rp)"

layoutpos="client">

<element

layout="flowlayout(0,2,1,0)"

layoutpos="left"

margin="rect(0rp,0rp,10rp,0rp)"

padding="rect(0rp,0rp,0rp,2rp)">

<element id="atom(NetworkIcon)"

class="DynamicSizedIcon"

accrole="none"

/>

</element>

<RichText

id="atom(NetworkName)"

class="SemiBoldText"

layoutpos="left"

contentalign="middleleft|endellipsis"

accrole="statictext"

accessible="true"

/>

</element>

<element

id="atom(SNLPageContainer)"

layout="flowlayout()">

</element>

</element>

<element

resid="SNLPage"

id="atom(SNLPage)"

sheet="ModernStyle"

layout="borderlayout()"

width="265rp">

<RichText

class="NormalText"

layoutpos="top"

contentalign="wrapleft"

accrole="statictext"

content="resstr(18402)"

margin="rect(0rp, 0rp, 0rp, 28rp)"

padding="rect(0rp, 31rp, 0rp, 0rp)"

accessible="true"

/>

<element

layout="borderlayout()">

<element

layout="flowlayout()"

layoutpos="right">

<TouchButton

id="atom(privateButton)"

handleenter="true"

content="resstr(18403)"

layoutpos="right"

class="default"

/>

<TouchButton

id="atom(publicButton)"

handleenter="true"

content="resstr(18405)"

layoutpos="right"

margin="rect(20rp, 0rp, 0rp, 0rp)"

/>

</element>

</element>

</element>

<stylesheets>

<style resid="ModernStyle" base="ressheet(ImmersiveStyles, library(Windows.UI.Immersive.dll), Dark)">

<if class="SemiBoldText">

<RichText

foreground="buttontext"

font="iconfont;125%;semibold"/>

</if>

<if class="NormalText">

<RichText

foreground="buttontext"

font="iconfont;125%"/>

</if>

</style>

</stylesheets>

</duixml>

 