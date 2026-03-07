import{j as e}from"./jsx-runtime-BO8uF4Og.js";import{r as n}from"./index-D4H_InIO.js";import{c as o}from"./utils-BLSKlp9E.js";import{B as x}from"./button-bbzOYMIu.js";const s=n.forwardRef(({className:r,...t},a)=>e.jsx("div",{ref:a,className:o("rounded-xl border bg-card text-card-foreground shadow",r),...t}));s.displayName="Card";const c=n.forwardRef(({className:r,...t},a)=>e.jsx("div",{ref:a,className:o("flex flex-col space-y-1.5 p-6",r),...t}));c.displayName="CardHeader";const l=n.forwardRef(({className:r,...t},a)=>e.jsx("h3",{ref:a,className:o("font-semibold leading-none tracking-tight",r),...t}));l.displayName="CardTitle";const p=n.forwardRef(({className:r,...t},a)=>e.jsx("p",{ref:a,className:o("text-sm text-muted-foreground",r),...t}));p.displayName="CardDescription";const C=n.forwardRef(({className:r,...t},a)=>e.jsx("div",{ref:a,className:o("p-6 pt-0",r),...t}));C.displayName="CardContent";const m=n.forwardRef(({className:r,...t},a)=>e.jsx("div",{ref:a,className:o("flex items-center p-6 pt-0",r),...t}));m.displayName="CardFooter";s.__docgenInfo={description:"",methods:[],displayName:"Card"};c.__docgenInfo={description:"",methods:[],displayName:"CardHeader"};m.__docgenInfo={description:"",methods:[],displayName:"CardFooter"};l.__docgenInfo={description:"",methods:[],displayName:"CardTitle"};p.__docgenInfo={description:"",methods:[],displayName:"CardDescription"};C.__docgenInfo={description:"",methods:[],displayName:"CardContent"};const F={title:"UI/Card",component:s,parameters:{layout:"centered"},tags:["autodocs"]},d={render:()=>e.jsxs(s,{className:"w-[350px]",children:[e.jsxs(c,{children:[e.jsx(l,{children:"Card Title"}),e.jsx(p,{children:"Card description with some extra text to show how it wraps."})]}),e.jsx(C,{children:e.jsx("p",{children:"Card content goes here. You can put any React content inside."})}),e.jsx(m,{children:e.jsx(x,{children:"Action"})})]})},i={render:()=>e.jsxs(s,{className:"w-[350px]",children:[e.jsxs(c,{children:[e.jsx(l,{children:"Create account"}),e.jsx(p,{children:"Enter your details below to create your account."})]}),e.jsx(C,{children:"Form or content..."}),e.jsxs(m,{className:"flex justify-between",children:[e.jsx(x,{variant:"outline",children:"Cancel"}),e.jsx(x,{children:"Continue"})]})]})};var u,f,h;d.parameters={...d.parameters,docs:{...(u=d.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          Card description with some extra text to show how it wraps.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. You can put any React content inside.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
}`,...(h=(f=d.parameters)==null?void 0:f.docs)==null?void 0:h.source}}};var j,N,w;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>
          Enter your details below to create your account.
        </CardDescription>
      </CardHeader>
      <CardContent>Form or content...</CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Continue</Button>
      </CardFooter>
    </Card>
}`,...(w=(N=i.parameters)==null?void 0:N.docs)==null?void 0:w.source}}};const R=["Default","WithActions"];export{d as Default,i as WithActions,R as __namedExportsOrder,F as default};
