using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Com.Reactlibrary.RNEduLibrary
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNEduLibraryModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNEduLibraryModule"/>.
        /// </summary>
        internal RNEduLibraryModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNEduLibrary";
            }
        }
    }
}
