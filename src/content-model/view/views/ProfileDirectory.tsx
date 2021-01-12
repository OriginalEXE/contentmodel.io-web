import { observer } from 'mobx-react-lite';

import ContentModelsList from '@/src/content-model/components/ContentModelsList/ContentModelsList';
import { ParsedDbContentModel } from '@/src/content-model/types/parsedDbContentModel';
import Header from '@/src/header/components/Header/Header';

interface ProfileDirectoryViewProps {
  contentModels: ParsedDbContentModel[];
}

const ProfileDirectoryView: React.FC<ProfileDirectoryViewProps> = observer(
  (props) => {
    const { contentModels } = props;

    return (
      <>
        <Header />
        <main className="container mx-auto px-3 mb-4 xl:flex xl:mt-12 xl:mb-8">
          <div className="w-full max-w-xl mt-8 mx-auto flex-shrink-0 xl:w-72 xl:mt-2">
            <h1 className="text-2xl font-bold text-center">
              Content models shared by you
            </h1>
            <ContentModelsList
              contentModels={contentModels}
              className="mt-6 md:mt-12"
            />
          </div>
        </main>
      </>
    );
  },
);

ProfileDirectoryView.displayName = 'ProfileDirectoryView';

export default ProfileDirectoryView;
