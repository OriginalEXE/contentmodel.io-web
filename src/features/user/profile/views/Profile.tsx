import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

import Footer from '@/src/features/footer/Footer';
import Header from '@/src/features/header/components/Header/Header';
import { GetCurrentUserResult } from '@/src/features/user/api/getCurrentUser';
import updateUser from '@/src/features/user/api/updateUser';
import Button from '@/src/shared/components/Button/Button';
import { useStore } from '@/store/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ProfileViewProps {
  user: GetCurrentUserResult['me'];
}

const ProfileView: React.FC<ProfileViewProps> = observer((props) => {
  const { user } = props;
  const store = useStore();
  const router = useRouter();

  const [viewError, setViewError] = useState<string | null>(null);
  const [viewState, setViewState] = useState<
    'idle' | 'error' | 'processing' | 'success'
  >('idle');
  const updateUserMutation = useMutation(updateUser, {
    onMutate: () => {
      setViewState('processing');
    },
    onError: () => {
      setViewState('error');
      setViewError('Something went wrong, please try again');
    },
    onSuccess: (data) => {
      if (store.me === null) {
        return;
      }

      store.setMe({
        ...store.me,
        name: data.updateUser.name,
      });

      setViewState('success');

      setTimeout(() => {
        setViewState((x) => (x === 'success' ? 'idle' : x));

        if (typeof router.query.redirectTo === 'string') {
          router.push(router.query.redirectTo);
        }
      }, 2000);
    },
  });

  const { register, handleSubmit, errors } = useForm({
    defaultValues: user,
  });

  const onSubmit = async (data: GetCurrentUserResult['me']) => {
    if (viewState === 'processing') {
      return;
    }

    if (store.me?.id === undefined) {
      setViewState('error');
      return;
    }

    updateUserMutation.mutate({
      id: store.me.id,
      name: data.name,
    });
  };

  return (
    <>
      <Header />
      <main className="w-full max-w-screen-2xl mx-auto px-3 mb-8 xl:flex xl:mt-12">
        <div className="w-full max-w-lg mt-8 mx-auto flex-shrink-0">
          <div className="w-16 h-16 flex items-center justify-center rounded-full text-3xl bg-red-200 transform -rotate-6">
            <FontAwesomeIcon icon={['fal', 'user']} />
          </div>
          <h1 className="mt-4 text-2xl font-bold max-w-sm lg:text-3xl xl:text-4xl">
            My profile
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
            <label className="block">
              <p className="text-lg font-semibold">Name</p>
              <input
                name="name"
                ref={register({ required: true })}
                type="text"
                className="mt-2 appearance-none rounded-lg border bg-white w-full leading-loose p-2 text-gray-900 focus:outline-none focus:ring-2"
              />
            </label>
            {errors.name ? (
              <p className="mt-2 text-sm text-red-700">Name is required</p>
            ) : null}
            <p className="text-sm mt-2">
              Your name will be shown accross ContentModel.io in connection to
              your activity. You can change it at any time.
            </p>
            {viewState === 'error' && viewError !== null ? (
              <p className="mt-4 text-base text-red-700">{viewError}</p>
            ) : null}
            <footer className="mt-8 flex justify-end">
              <Button
                color="primary"
                type="submit"
                disabled={viewState === 'processing'}
              >
                {viewState === 'success'
                  ? 'Profile updated'
                  : viewState === 'processing'
                  ? 'Updating'
                  : 'Update profile'}
              </Button>
            </footer>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
});

ProfileView.displayName = 'ProfileView';

export default ProfileView;
