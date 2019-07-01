declare module 'file-icons-js' {
    // Type definitions for file-icons-js 1.0
    // Project: https://github.com/websemantics/file-icons-js
    // Definitions by: Yatao Li <https://github.com/me>
    // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

    export function getClass(name: any): any;
    
    export function getClassWithColor(name: any): any;
    
    export namespace db {
        const directoryIcons: {
            byInterpreter: any[];
            byLanguage: any[];
            byName: {
                colour: string[];
                getClass: any;
                icon: string;
                index: number;
                interpreter: any;
                lang: any;
                match: RegExp;
                matchPath: boolean;
                priority: number;
                scope: any;
                signature: any;
            }[];
            byPath: any[];
            byScope: any[];
            bySignature: any[];
        };
        
        const fileIcons: {
            byInterpreter: {
                colour: string[];
                getClass: any;
                icon: string;
                index: number;
                interpreter: RegExp;
                lang: RegExp;
                match: RegExp;
                matchPath: boolean;
                priority: number;
                scope: RegExp;
                signature: any;
            }[];
            byLanguage: {
                colour: string[];
                getClass: any;
                icon: string;
                index: number;
                interpreter: any;
                lang: RegExp;
                match: RegExp;
                matchPath: boolean;
                priority: number;
                scope: RegExp;
                signature: any;
            }[];
            byName: {
                colour: string[];
                getClass: any;
                icon: string;
                index: number;
                interpreter: any;
                lang: any;
                match: RegExp;
                matchPath: boolean;
                priority: number;
                scope: any;
                signature: any;
            }[];
            byPath: {
                colour: string[];
                getClass: any;
                icon: string;
                index: number;
                interpreter: any;
                lang: any;
                match: RegExp;
                matchPath: boolean;
                priority: number;
                scope: any;
                signature: any;
            }[];
            byScope: {
                colour: string[];
                getClass: any;
                icon: string;
                index: number;
                interpreter: any;
                lang: RegExp;
                match: RegExp;
                matchPath: boolean;
                priority: number;
                scope: RegExp;
                signature: any;
            }[];
            bySignature: {
                colour: string[];
                getClass: any;
                icon: string;
                index: number;
                interpreter: any;
                lang: any;
                match: RegExp;
                matchPath: boolean;
                priority: number;
                scope: any;
                signature: RegExp;
            }[];
        };
        
        function matchInterpreter(name: any): any;
        
        function matchLanguage(name: any): any;
        
        function matchName(name: any, directory: any): any;
        
        function matchPath(path: any, directory: any): any;
        
        function matchScope(name: any): any;
        
        function matchSignature(data: any): void;
        
        function read(table: any): any;
        
        namespace binaryIcon {
            const colour: string[];
            
            const icon: string;
            
            const index: number;
            
            const interpreter: any;
            
            const lang: RegExp;
            
            const match: RegExp;
            
            const matchPath: boolean;
            
            const priority: number;
            
            const scope: RegExp;
            
            const signature: any;
            
            function getClass(colourMode: any, asArray: any): any;
            
        }
        
        namespace executableIcon {
            const colour: string[];
            
            const icon: string;
            
            const index: number;
            
            const interpreter: RegExp;
            
            const lang: RegExp;
            
            const match: RegExp;
            
            const matchPath: boolean;
            
            const priority: number;
            
            const scope: RegExp;
            
            const signature: any;
            
            function getClass(colourMode: any, asArray: any): any;
            
        }
        
    }
    
}
