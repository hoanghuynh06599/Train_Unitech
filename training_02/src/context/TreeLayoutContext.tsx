import { Dispatch, createContext, useState } from "react"

interface ITreeLayoutContext {
    treeLayout: JSX.Element;
    setTreeLayout: Dispatch<React.SetStateAction<JSX.Element>>
}

const TreeLayoutContext = createContext<ITreeLayoutContext | undefined>(undefined);

const TreeLayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [treeLayout, setTreeLayout] = useState<JSX.Element>(<p></p>)

    const values = {treeLayout, setTreeLayout}

    return (
        <TreeLayoutContext.Provider value={values}>
            {children}
        </TreeLayoutContext.Provider>
    )
}

export { TreeLayoutProvider, TreeLayoutContext }
